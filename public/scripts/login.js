$(document).ready(() => {
  $('#login').on('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();

    $.post('/login', $('#login').serialize())
      .done(() => {
        window.location.replace('/order');
      })
      .fail(res => {
        $('#passwordInput').val('');
        if (res.responseJSON === 'Wrong Email') {
          $('#emailInput').val('');
        }
        $('#login-error').text(res.responseJSON).slideDown(5000);
      })
  })
});