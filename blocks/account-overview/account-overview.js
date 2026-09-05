const ORDERS_KEY = "order-history";

function getOrders() {
  const orders = localStorage.getItem(ORDERS_KEY);
  return orders ? JSON.parse(orders) : [];
}

export default function decorate(block) {
  const myOrderLink = block
    .closest(".account-overview-container")
    ?.querySelector('.default-content-wrapper a[href="/orders"]');
  if (myOrderLink) {
    myOrderLink.classList.add("account-btn", "account-order-link");
  }
  const orders = getOrders();
  const profile = {
    name: "Sachin Rastogi",
    email: "sachin@example.com",
  };
  const lastOrder = orders[0];
  block.innerHTML = `
    <div class="account-overview">
      <div class="account-profile-card">
        <div class="account-avatar">
          ${profile.name.charAt(0)}
        </div>
        <div class="account-profile-info">
          <h2>
            ${profile.name}
          </h2>
          <p>
            ${profile.email}
          </p>
        </div>
      </div>
      <div class="account-stats">
        <div class="account-stat-card">
          <span class="stat-value">
            ${orders.length}
          </span>
          <span class="stat-label">
            Total Orders
          </span>
        </div>
        <div class="account-stat-card">
          <span class="stat-value">
            ${lastOrder ? lastOrder.orderId : "-"}
          </span>
          <span class="stat-label">
            Latest Order
          </span>
        </div>
      </div>
    </div>`;
}
