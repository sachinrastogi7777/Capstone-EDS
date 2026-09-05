import { getItems, getCartTotal } from "../../scripts/cart.js";

export default function decorate(block) {
  const items = getItems();
  console.log(items);
  const subtotal = getCartTotal();
  block.innerHTML = `
    <div class="checkout-summary">
      <h2>Order Summary</h2>
      <div class="summary-products">
        ${items
          .map(
            (item) => `
              <div class="summary-item">
              <img src="${item.thumbnail}" alt="${item.title}" />
                <div class="summary-product-info">
                  <div>
                    <h4>
                      ${item.title}
                    </h4>
                    <p>
                      Qty: ${item.quantity}
                    </p>
                  </div>
                  <div class="summary-price">
                    $${(
                      item.price *
                      (1 - (Math.round(item.discountPercentage) || 0) / 100) *
                      item.quantity
                    ).toFixed(2)}
                  </div>
                </div>
              </div>`,
          )
          .join("")}
      </div>
      <div class="summary-totals">
        <div class="total-row">
          <span>Subtotal</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div class="total-row total">
          <span>Total</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>`;
}
