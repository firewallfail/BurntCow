$(document).ready(() => {
  const $menu = $("#checkout");
  const cart = getCart();
  for (const id in cart) {
    $.get(`/food/${id}`)
      .done(item => {
        const $leftDiv = $(`<div>`);
        const $rightDiv = $(`<div>`);
        const $article = $(`<article data-id=${item.id}>`);
        $leftDiv.append(`<img src="${item.picture}">`);
        $leftDiv.append(`<span class="food-name">${item.item}</span>`);
        $leftDiv.append(`<span class="food-description">${item.description}</span>`);
        $article.append($leftDiv);
        $rightDiv.append(`<i class="btn fa-solid fa-plus"></i>`);
        $rightDiv.append(`<i class="btn fa-solid fa-minus"></i>`);
        $rightDiv.append(`<span class="item-qty">${cart[id]}</span>`);
        $rightDiv.append(`<span class="food-cost" data-cost=${item.price}>${toDollar(item.price)}</span>`);
        $rightDiv.append(`<button class="btn btn-danger fa fa-close"></button>`);
        $article.append($rightDiv);
        $menu.append($article);
        $article.find(".fa-plus").on("click", () => {
          incrementItem(item.id);
          const $counter = $article.find(".item-qty");
          $counter.text(parseInt($counter.text(), 10) + 1);
          updateCart();
          updatePrice();
        });
        $article.find(".fa-minus").on("click", () => {
          const $counter = $article.find(".item-qty");
          decrementItem(item.id);
          $counter.text(parseInt($counter.text(), 10) - 1);
          if (parseInt($counter.text(), 10) === 0) {
            removeFromCart(item.id);
          }
          updateCart();
          updatePrice();
        });
        $article.find(".fa-close").on("click", () => {
          removeFromCart(item.id);
          $article.remove();
          updateCart();
          updatePrice();
        });
        updatePrice();
      })
      .fail(error => {
        console.log(error);
      });
  }
  $("#checkoutButton").on('click', checkoutOrder);
});

const updatePrice = () => {
  const $subtotal = $("#subtotal");
  const $taxes = $("#taxes");
  const $total = $("#total");
  let subTotal = 0;
  $("article").each(function() {
    let qty = parseInt($(this).find(".item-qty").text(), 10);
    let cost = parseInt($(this).find(".food-cost").data("cost"), 10);
    subTotal += cost * qty;
  });
  $subtotal.text(toDollar(subTotal));
  $taxes.text(toDollar(subTotal * .15));
  $total.text(toDollar(subTotal * 1.15));
};

const checkoutOrder = () => {
  $.post("/order", getCart())
    .done((data) => {
      console.log(data);
      setTimeout(() => {
        const $modal = $("#exampleModal > div > div > div.modal-body.d-flex.flex-column.align-items-center");
        $modal.empty();
        $modal.append("<h5>Thank you for purchasing your lunch with us!</h5>");
        $modal.append(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
        </svg>
        `);
        $modal.append(`<p>Your order has been confirmed as order#${data}<p>`);
        let prep = new Date(Date.now() + (30 * 60 * 1000));
        $modal.append(`<p>It will be ready in 30 minutes, at ${prep.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>`);
      }, 1000);
    });
};
