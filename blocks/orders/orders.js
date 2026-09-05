const ORDERS_KEY = "order-history";

function getOrders() {
  const orders = localStorage.getItem(ORDERS_KEY);
  return orders ? JSON.parse(orders) : [];
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })} • ${date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}`;
}

export default function decorate(block) {
  const orders = getOrders();
  if (!orders.length) {
    block.innerHTML = `
      <div class="orders-empty">
        <h2>No Orders Found</h2>
        <p>
          You haven't placed any orders yet.
        </p>
        <a href="/shop">
          Continue Shopping
        </a>
      </div>`;
    return;
  }

  block.innerHTML = `
    <div class="orders-page">
      ${orders
        .map(
          (order, index) => `
            <div class="order-card">
              <button
                class="order-header"
                data-index="${index}"
              >
                <div>
                  <h3>
                    ${order.orderId}
                  </h3>
                  <p>
                    ${formatDate(order.orderDate)}
                  </p>
                </div>
                <div class="order-meta">
                  <span class="order-total">
                    $${Number(order.total || 0).toFixed(2)}
                  </span>
                  <span class="order-badge">
                    Delivered
                  </span>
                </div>
              </button>
              <div class="order-content">
                <div class="order-items">
                  ${order.items
                    .map(
                      (item) => `
                        <div class="order-item">
                          <img src="${item.thumbnail}" alt="${item.title}" />
                          <div class="item-details">
                            <h4>
                              ${item.title}
                            </h4>
                            <p>
                              Quantity:
                              ${item.quantity}
                            </p>
                          </div>
                          <div class="item-price">
                            $${(
                              item.price *
                              (1 - (item.discountPercentage || 0) / 100) *
                              item.quantity
                            ).toFixed(2)}
                          </div>
                        </div>`,
                    )
                    .join("")}
                </div>
              </div>
            </div>`,
        )
        .join("")}
    </div>`;

  block.querySelectorAll(".order-header").forEach((header) => {
    header.addEventListener("click", () => {
      const card = header.closest(".order-card");
      card.classList.toggle("expanded");
    });
  });
}
