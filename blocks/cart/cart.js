import {
  getItems,
  getCartTotal,
  updateQuantity,
  removeItem,
} from "../../scripts/cart.js";

export default function decorate(block) {
  function renderCart() {
    const items = getItems();
    console.log(items)
    if (!items.length) {
      block.innerHTML = `
        <div class="empty-cart">
          <h2>Your Cart Is Empty</h2>
          <a href="/shop">Continue Shopping</a>
        </div>`;
      return;
    }
    const subtotal = getCartTotal();
    block.innerHTML = `
      <div class="cart-layout">
        <div class="cart-items">
          <h1>Cart</h1>
          ${items
            .map((item) => {
              const discount = Math.round(item.discountPercentage || 0);
              const discountedPrice = (
                item.price *
                (1 - discount / 100)
              ).toFixed(2);
              return `
                  <div class="cart-item" data-id="${item.id}">
                    <img
                      class="cart-item-thumb"
                      src="${item.thumbnail}"
                      alt="${item.title}"
                    />
                    <div class="cart-item-info">
                      <h3>${item.title}</h3>
                      <div class="featured-product-pricing">
                        <span class="original-price">
                          $${item.price}
                        </span>
                        <span class="discount-price">
                          $${discountedPrice}
                        </span>
                        <span class="discount-badge">
                          (${discount}% OFF)
                        </span>
                      </div>
                    </div>
                    <div class="cart-qty">
                      <button class="qty-minus" data-id="${item.id}">-</button>
                      <span>${item.quantity}</span>
                      <button class="qty-plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}" aria-label="Remove item">
                      🗑
                    </button>
                  </div>`;
            })
            .join("")}
        </div>
        <aside class="order-summary">
          <h2>Order Summary</h2>
          <div class="summary-row">
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>
          <a class="btn-continue" href="/shop">Continue Shopping</a>
          <a class="btn-checkout" href="/checkout">Proceed To Checkout</a>
        </aside>
      </div>
    `;
    attachEvents();
  }

  function attachEvents() {
    block.querySelectorAll(".qty-plus").forEach((button) => {
      button.addEventListener("click", () => {
        const id = Number(button.dataset.id);
        const item = getItems().find(
          (product) => String(product.id) === String(id),
        );
        updateQuantity(id, item.quantity + 1);
        renderCart();
      });
    });

    block.querySelectorAll(".qty-minus").forEach((button) => {
      button.addEventListener("click", () => {
        const id = Number(button.dataset.id);
        const item = getItems().find(
          (product) => String(product.id) === String(id),
        );
        if (item.quantity - 1 <= 0) {
          removeItem(id);
        } else {
          updateQuantity(id, item.quantity - 1);
        }
        renderCart();
      });
    });

    block.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", () => {
        removeItem(Number(button.dataset.id));
        renderCart();
      });
    });
  }
  renderCart();
}
