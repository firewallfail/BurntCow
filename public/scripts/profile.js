$(document).ready(() => {

  const $messageBox = $('#update-message');

  const $form = $("#update-form");
  $form.on('submit', (event) => {
    // $messageBox.slideUp();
    event.preventDefault();
    event.stopPropagation();

    $.post("/profile", $form.serialize())
      .done(() => {
        $messageBox.slideUp(400, () => {
          $messageBox.slideDown(600).text('Profile updated');
        });
      })
      .fail(response => {
        $messageBox.slideUp(400, () => {
          $messageBox.slideDown(600).text('Email or Number already in use');
        });
      });
  });

  $("input[type='tel']").inputmask({
    mask: "(999) 999-9999",
    autoUnmask: true
  });

  const passwordInput = document.querySelector("#passwordInput");
  const confirmPasswordInput = document.querySelector("#confirmPasswordInput");

  const validatePassword = () => {
    if (passwordInput.value !== confirmPasswordInput.value) {
      confirmPasswordInput.setCustomValidity('Passwords must match');
    } else {
      confirmPasswordInput.setCustomValidity('');
    }
  };

  passwordInput.addEventListener('change', validatePassword);
  confirmPasswordInput.addEventListener('change', validatePassword);

});
