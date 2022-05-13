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

const removeFromCart = (id) => {
  const cart = getCart();
  delete cart[id];
  setCart(cart);
};

const incrementItem = (id) => {
  const cart = getCart();
  ++cart[id];
  setCart(cart);
};

const decrementItem = (id) => {
  const cart = getCart();
  --cart[id];
  setCart(cart);
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
        const $listItem = $(`<li class="item" data-id="${item.id}">`);
        $listItem.append(`
        <div class="left-group">
          <img src="${item.picture}" alt="" />
          <div class="item-info">
            <span>${item.item}</span>
            <span>Price: ${toDollar(item.price)}</span>
          </div>
        </div>
        <div class="right-group">
          <div class="d-flex flex-column">
            <i class="btn fa-solid fa-plus"></i>
            <i class="btn fa-solid fa-minus"></i>
          </div>
          <label class="counter">${cart[item.id]}</label>
          <button class="btn btn-danger fa fa-close"></button>
        </div>
        `);
        $cartMenu.append($listItem);

        $listItem.find(".fa-plus").on("click", function() {
          incrementItem(item.id);
          const $counter = $listItem.find(".counter");
          $counter.text(parseInt($counter.text(), 10) + 1);
        });
        $listItem.find(".fa-minus").on("click", function() {
          const $counter = $listItem.find(".counter");
          decrementItem(item.id);
          $counter.text(parseInt($counter.text(), 10) - 1);
          if (parseInt($counter.text(), 10) < 1) {
            removeFromCart(item.id);
          }
        });
        $listItem.find(".fa-close").on("click", function() {
          removeFromCart(item.id);
          $listItem.slideUp(() => {
            $listItem.remove();
            if ($cartMenu.is(":empty")) {
              $cartMenu.append(`<li><span class="dropdown-item-text">Your cart is currently empty!</span></li>`);
            }
          });
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
};
