export default function decorate(block) {
  const orders = JSON.parse(localStorage.getItem("order-history") || "[]");
  const latestOrder = orders.length > 0 ? orders[0] : null;
  block.innerHTML = `
    <div class="order-success-card">
      <div class="success-icon">
        ✅
      </div>
      <h2>
        Order Placed Successfully
      </h2>
      <p class="success-message">
        Thank you for your purchase.
      </p>
      ${
        latestOrder
          ? `
            <div class="order-meta">
              <p>
                <strong>Order ID:</strong>
                ${latestOrder.orderId}
              </p>
              <p>
                <strong>Order Date:</strong>
                ${new Date(latestOrder.orderDate).toLocaleString()}
              </p>
            </div>`
          : ""
      }
    </div>`;
}
