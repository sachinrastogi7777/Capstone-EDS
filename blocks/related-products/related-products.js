import createProductCard from "../../scripts/product-card.js";
import {
  addItem,
  getItemQuantity,
  updateQuantity,
  removeItem,
} from "../../scripts/cart.js";

export default async function decorate(block) {
  const productId = new URLSearchParams(window.location.search).get("id");
  if (!productId) {
    return;
  }

  const response = await fetch("/products-list.json?sheet=data");
  const data = await response.json();
  const products = data.data || [];
  const currentProduct = products.find(
    (product) => String(product.id) === String(productId),
  );

  if (!currentProduct) {
    return;
  }

  const relatedProducts = products
    .filter(
      (product) =>
        product.category === currentProduct.category &&
        product.id !== currentProduct.id,
    )
    .slice(0, 4);

  block.innerHTML = `
    <div class="related-products-wrapper">
      <h2>
        Related Products
      </h2>
      <div class="related-products-grid">
      </div>
    </div>`;

  const grid = block.querySelector(".related-products-grid");

  relatedProducts.forEach((product) => {
    const card = createProductCard(product, "shop");
    function renderQuantityUI() {
      const quantity = getItemQuantity(product.id);
      const wrapper = card.querySelector(".product-qty-wrapper");
      if (!wrapper) {
        return;
      }
      if (quantity === 0) {
        wrapper.innerHTML = `
          <button
            class="add-to-cart-btn">
            Add To Cart
          </button>`;

        wrapper
          .querySelector(".add-to-cart-btn")
          .addEventListener("click", () => {
            addItem(product);
            renderQuantityUI();
          });
      } else {
        wrapper.innerHTML = `
          <div class="qty-controls">
            <button class="qty-minus">
              -
            </button>
            <span class="qty-value">
              ${quantity}
            </span>
            <button class="qty-plus">
              +
            </button>
          </div>`;

        wrapper.querySelector(".qty-plus").addEventListener("click", () => {
          updateQuantity(product.id, quantity + 1);
          renderQuantityUI();
        });

        wrapper.querySelector(".qty-minus").addEventListener("click", () => {
          if (quantity <= 1) {
            removeItem(product.id);
          } else {
            updateQuantity(product.id, quantity - 1);
          }
          renderQuantityUI();
        });
      }
    }
    renderQuantityUI();
    grid.append(card);
  });
}
