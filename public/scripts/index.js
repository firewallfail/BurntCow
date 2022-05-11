$(document).ready(() => {
  const $menu = $("#menu");
  $.post("/")
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
        $(`<button class="btn btn-success" data-food-id=${item.id}>Add</button>`).on('click', addToCart).on('click', updateCart).appendTo($rightDiv);
        $article.append($rightDiv);
        $menu.append($article);
      }
    })
    .fail(error => {
      console.log(error);
    });
});

const toDollar = (centsValue) => {
  return "$" + (centsValue / 100).toFixed(2);
};

const addToCart = function() {
  const { foodId } = this.dataset;
  const cart = JSON.parse(Cookies.get("cart") || "{}");
  cart[foodId] = ++cart[foodId] || 1;
  console.log(cart);
  Cookies.set("cart", JSON.stringify(cart));
};

const updateCart = function() {

};
