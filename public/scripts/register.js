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
});
