$(document).ready(() => {
  $menu = $("#menu");
  $.post("/")
    .done(data => {
      for (const item of data) {
        $leftDiv = $(`<div>`);
        $rightDiv = $(`<div>`);
        $article = $(`<article data-id=${item.id}>`);
        $leftDiv.append(`<img src="${item.picture}">`);
        $leftDiv.append(`<span class="food-name">${item.item}</span>`);
        $article.append($leftDiv);
        $article.append(`<span class="food-description">${item.description}</span>`);
        $rightDiv.append(`<span class="food-cost">${toDollar(item.price)}</span>`);
        $(`<button class="btn btn-success" data-food-id=${item.id}>Add</button>`).on('click', addToCart).appendTo($rightDiv);
        $article.append($rightDiv);
        $menu.append($article);
      }
    })
    .fail(error => {
      console.log(error);
    });
  //update local cart using DB
});

const toDollar = (centsValue) => {
  return "$" + (centsValue / 100).toFixed(2);
};

const addToCart = function(event) {
  console.log(this.dataset.foodId);
  //send to cart
  //update local cart using DB
};
