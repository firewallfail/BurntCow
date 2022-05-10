$(document).ready(() => {
  $('#login').on('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();

    $.post('/login', $('#login').serialize())
      .done(() => {
        window.location.replace('/order');
      })
      .fail(res => {
        console.log(res);
      })
  })
});
