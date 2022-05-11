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
        if (res.responseJSON === 'Wrong Email') { // Make error message more generic ("Incorrect credentials")
          $('#emailInput').val('');
        }
        $('#login-error').text(res.responseJSON).slideDown(5000);
      });
  });
});
