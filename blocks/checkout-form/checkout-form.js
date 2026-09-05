import { getItems, getCartTotal, clearCart } from "../../scripts/cart.js";
import { saveOrder } from "../../scripts/order.js";

export default function decorate(block) {
  const rows = [...block.children];
  const data = {};
  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) {
      return;
    }
    const key = cols[0].textContent.trim();
    const value = cols[1].textContent.trim();
    data[key] = value;
  });

  block.innerHTML = `
    <form
      class="checkout-form"
      novalidate
    >
      <h2>Contact Information</h2>
      <div class="form-grid">
        <div class="form-field">
          <label for="first-name">
            ${data["First Name"]}
            <span class="required">*</span>
          </label>
          <input
            id="first-name"
            name="first-name"
            type="text"
            aria-required="true"
          />
          <span class="field-error"></span>
        </div>
        <div class="form-field">
          <label for="last-name">
            ${data["Last Name"]}
            <span class="required">*</span>
          </label>
          <input
            id="last-name"
            name="last-name"
            type="text"
            aria-required="true"
          />
          <span class="field-error"></span>
        </div>
        <div class="form-field">
          <label for="email">
            ${data["Email"]}
            <span class="required">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            aria-required="true"
          />
          <span class="field-error"></span>
        </div>
        <div class="form-field">
          <label for="phone">
            ${data["Phone"]}
            <span class="required">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            aria-required="true"
          />
          <span class="field-error"></span>
        </div>
      </div>
      <h2>Shipping Address</h2>
      <div class="form-grid">
        <div class="form-field full">
          <label for="address1">
            ${data["Address 1"]}
            <span class="required">*</span>
          </label>
          <input
            id="address1"
            name="address1"
            type="text"
            aria-required="true"
          />
          <span class="field-error"></span>
        </div>
        <div class="form-field full">
          <label for="address2">
            ${data["Address 2"]}
          </label>
          <input
            id="address2"
            name="address2"
            type="text"
          />
          <span class="field-error"></span>
        </div>
        <div class="form-field">
          <label for="city">
            ${data["City"]}
            <span class="required">*</span>
          </label>
          <input
            id="city"
            name="city"
            type="text"
            aria-required="true"
          />
          <span class="field-error"></span>
        </div>
        <div class="form-field">
          <label for="state">
            ${data["State"]}
            <span class="required">*</span>
          </label>
          <input
            id="state"
            name="state"
            type="text"
            aria-required="true"
          />
          <span class="field-error"></span>
        </div>
        <div class="form-field">
          <label for="country">
            ${data["Country"]}
            <span class="required">*</span>
          </label>
          <input
            id="country"
            name="country"
            type="text"
            aria-required="true"
          />
          <span class="field-error"></span>
        </div>
        <div class="form-field">
          <label for="postal-code">
            ${data["Postal Code"]}
            <span class="required">*</span>
          </label>
          <input
            id="postal-code"
            name="postal-code"
            type="text"
            aria-required="true"
          />
          <span class="field-error"></span>
        </div>
      </div>
      <button
        type="submit"
        class="place-order-btn"
        aria-label="Place Order"
      >
        ${data["Button Text"]}
      </button>
    </form>`;

  const form = block.querySelector(".checkout-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let valid = true;
    form.querySelectorAll(".field-error").forEach((error) => {
      error.textContent = "";
    });
    const requiredFields = [
      "first-name",
      "last-name",
      "email",
      "phone",
      "address1",
      "city",
      "state",
      "country",
      "postal-code",
    ];
    requiredFields.forEach((id) => {
      const input = document.getElementById(id);
      const error = input.parentElement.querySelector(".field-error");
      if (!input.value.trim()) {
        error.textContent = "This field is required";
        valid = false;
      }
    });

    const email = document.getElementById("email");
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.parentElement.querySelector(".field-error").textContent =
        "Please enter a valid email address";
      valid = false;
    }

    const phone = document.getElementById("phone");
    if (phone.value && !/^[0-9]{10}$/.test(phone.value)) {
      phone.parentElement.querySelector(".field-error").textContent =
        "Please enter a valid 10 digit phone number";
      valid = false;
    }

    const postalCode = document.getElementById("postal-code");
    if (postalCode.value && !/^[0-9]{6}$/.test(postalCode.value)) {
      postalCode.parentElement.querySelector(".field-error").textContent =
        "Please enter a valid 6 digit postal code";
      valid = false;
    }

    if (!valid) {
      return;
    }

    const order = {
      orderId: `ORD-${Date.now()}`,
      orderDate: new Date().toISOString(),
      items: getItems(),
      total: getCartTotal(),
      customer: {
        firstName: document.getElementById("first-name").value,
        lastName: document.getElementById("last-name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
      },
      shippingAddress: {
        address1: document.getElementById("address1").value,
        address2: document.getElementById("address2").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        country: document.getElementById("country").value,
        postalCode: document.getElementById("postal-code").value,
      },
    };
    saveOrder(order);
    clearCart();
    const toast = document.createElement("div");
    toast.className = "checkout-toast";
    toast.textContent = "✅ Order placed successfully!";
    document.body.appendChild(toast);
    setTimeout(() => {
      window.location.href = "/shop";
    }, 1500);
  });
}
