$(document).ready(() => {
  $("input[type='tel']").inputmask({
    mask: "(999) 999-9999",
    autoUnmask: true
  });
});
