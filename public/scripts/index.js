$(document).ready(() => {
  $menu = $("#menu");
  $.get("/food", {
    offset: 50,
    limit: 10
  })
    .done(data => {
      for (const item of data) {
        const $leftDiv = $(`<div>`);
        const $rightDiv = $(`<div>`);
        const $article = $(`<article data-id=${item.id}>`);
        $leftDiv.append(`<img src="${item.picture}">`);
        $leftDiv.append(`<span class="food-name">${item.item}</span>`);
        $article.append($leftDiv);
        $article.append(`<span class="food-description">${item.description}</span>`);
        $rightDiv.append(`<span class="food-cost">${toDollar(item.price)}</span>`);
        $(`<button class="btn btn-success" data-food-id=${item.id}>Add</button>`).on('click', addToCart).on('click',
          updateCart).appendTo($rightDiv);
        $article.append($rightDiv);
        $menu.append($article);
      }
    })
    .fail(error => {
      console.log(error);
    });
  updateCart();
});

const toDollar = (centsValue) => {
  return "$" + (centsValue / 100).toFixed(2);
};

const getCart = () => {
  return JSON.parse(Cookies.get("cart") || "{}");
};

const setCart = (object) => {
  Cookies.set("cart", JSON.stringify(object));
};

const addToCart = function () {
  const { foodId } = this.dataset;
  const cart = getCart();
  cart[foodId] = ++cart[foodId] || 1;
  console.log(cart);
  setCart(cart);
};

const updateCart = function () {
  const $cartMenu = $("#cart-items");
  const cart = getCart();
  $cartMenu.empty();

  if ($.isEmptyObject(cart)) {
    return $cartMenu.append(`<li><span class="dropdown-item-text">Your cart is currently empty!</span></li>`);
  }

  for (const id in cart) {
    $.get(`/food/${id}`)
      .then(item => {
        $cartMenu.append(`
        <li class="item" data-id="${item.id}">
          <div class="left-group">
            <img src="${item.picture}" alt="" />
            <div class="item-info">
              <span>${item.item}</span>
              <span>Price: ${toDollar(item.price)}</span>
            </div>
          </div>
          <div class="right-group">
            <input value=${cart[item.id]}>
            <button class="btn btn-danger fa fa-close"></button>
          </div>
        </li>
      `);
      })
      .catch(error => {
        console.log(error);
      });
  }
};
