$(document).ready(() => {
  const $menu = $("#checkout");
  for (const id in getCart()) {
    console.log(id);
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
        $rightDiv.append(`<span class="food-cost">${toDollar(item.price)}</span>`);
        $rightDiv.append(`<button class="btn btn-danger fa fa-close"></button>`);
        $article.append($rightDiv);
        $menu.append($article);
      })
      .fail(error => {
        console.log(error);
      });
  }
});
