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
