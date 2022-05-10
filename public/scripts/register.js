$(document).ready(() => {

  const displayError = (errorMessage) => {
    const $errorBox = $("#register-error");
    if (errorMessage === undefined) {
      return $errorBox.slideUp();
    }
    $errorBox.slideDown();
    $errorBox.text(errorMessage);
  };

  const $form = $("#register-form");
  $form.on('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();

    $.post("/register", $form.serialize())
      .done(() => {
        displayError();
        window.location.replace("/");
      })
      .fail(response => {
        displayError(response.responseJSON);
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
