// Client facing scripts here
$(document).ready(function() {

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  let forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function(form) {
      form.addEventListener('submit', function(event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }

        form.classList.add('was-validated');
      }, false);
    });
  updateCart();
});

const toDollar = (centsValue) => {
  return "$" + (centsValue / 100).toFixed(2);
};

const getCart = () => {
  return JSON.parse(Cookies.get("cart") || "{}");
};

const setCart = (object) => {
  Cookies.set("cart", JSON.stringify(object));
};

const addToCart = function() {
  const { foodId } = this.dataset;
  const cart = getCart();
  cart[foodId] = ++cart[foodId] || 1;
  setCart(cart);
};

const updateCart = function() {
  const $cartMenu = $("#cart-items");
  const cart = getCart();
  $cartMenu.empty();

  if ($.isEmptyObject(cart)) {
    return $cartMenu.append(`<li><span class="dropdown-item-text">Your cart is currently empty!</span></li>`);
  }

  for (const id in cart) {
    $.get(`/food/${id}`)
      .then(item => {
        $cartMenu.append(`
        <li class="item" data-id="${item.id}">
          <div class="left-group">
            <img src="${item.picture}" alt="" />
            <div class="item-info">
              <span>${item.item}</span>
              <span>Price: ${toDollar(item.price)}</span>
            </div>
          </div>
          <div class="right-group">
            <input value=${cart[item.id]}>
            <button class="btn btn-danger fa fa-close"></button>
          </div>
        </li>
      `);
      })
      .catch(error => {
        console.log(error);
      });
  }
};
