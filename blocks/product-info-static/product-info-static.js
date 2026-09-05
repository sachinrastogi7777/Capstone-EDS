export default function decorate(block) {
  const rows = [...block.children];
  const data = {};
  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) {
      return;
    }
    const key = cols[0].textContent.trim();
    const value = cols[1];
    data[key] = value;
  });

  const brand = data.Brand?.textContent.trim();
  const sku = data.SKU?.textContent.trim();
  const weight = data.Weight?.textContent.trim();
  const stock = data.Stock?.textContent.trim();
  const warranty = data.Warranty?.textContent.trim();
  const shipping = data.Shipping?.textContent.trim();
  const returnPolicy = data["Return Policy"]?.textContent.trim();

  block.innerHTML = `
    <div class="pdp-details">
      <div class="pdp-accordion expanded">
        <button class="accordion-header">
          Product Information
        </button>
        <div class="accordion-content">
          <table>
            <tr>
              <td>Brand</td>
              <td>${brand}</td>
            </tr>
            <tr>
              <td>SKU</td>
              <td>${sku}</td>
            </tr>
            <tr>
              <td>Weight</td>
              <td>${weight}</td>
            </tr>
            <tr>
              <td>Stock</td>
              <td>${stock}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="pdp-accordion">
        <button class="accordion-header">
          Shipping & Returns
        </button>
        <div class="accordion-content">
          <p>
            ${warranty}
          </p>
          <p>
            ${shipping}
          </p>
          <p>
            ${returnPolicy}
          </p>
        </div>
      </div>
    </div>`;

  block.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", () => {
      header.closest(".pdp-accordion").classList.toggle("expanded");
    });
  });
}
