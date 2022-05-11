$(document).ready(() => {
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
