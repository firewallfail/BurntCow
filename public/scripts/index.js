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
});
