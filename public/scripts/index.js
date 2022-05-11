$(document).ready(() => {
  $menu = $("#menu");
  $.post("/")
    .done(data => {
      for (const item of data) {
        $leftDiv = $('<div>');
        $rightDiv = $('<div>');
        $article = $(`<article data-id=${item.id}>`);
        $leftDiv.append(`<img src="${item.picture}">`);
        $leftDiv.append(`<span class="food-name">${item.item}</span>`);
        $article.append($leftDiv);
        $article.append(`<span class="food-description">${item.description}</span>`);
        $rightDiv.append(`<span class="food-cost">$${(item.price / 100).toFixed(2)}</span>`);
        $rightDiv.append(`<button class="btn btn-success">Add</button>`);
        $article.append($rightDiv);
        $menu.append($article);
      }
    })
    .fail(error => {
      console.log(error);
    });
});
