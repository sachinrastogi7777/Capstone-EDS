import {
  addItem,
  updateQuantity,
  getItemQuantity,
} from "../../scripts/cart.js";

export default async function decorate(block) {
  const productId = new URLSearchParams(window.location.search).get("id");
  if (!productId) {
    block.innerHTML = "<p>Product not found.</p>";
    return;
  }
  const response = await fetch("/products-list.json?sheet=data");
  const data = await response.json();
  const products = data.data || [];
  const product = products.find(
    (item) => String(item.id) === String(productId),
  );
  if (!product) {
    block.innerHTML = "<p>Product not found.</p>";
    return;
  }
  const discount = Math.round(product.discountPercentage);
  const discountedPrice = (product.price * (1 - discount / 100)).toFixed(2);
  const categoryProducts = products
    .filter(
      (item) => item.category === product.category && item.id !== product.id,
    )
    .slice(0, 4);
  const quantity = getItemQuantity(product.id);
  const tags =
    typeof product.tags === "string"
      ? product.tags
          .replace("[", "")
          .replace("]", "")
          .split(",")
          .map((tag) => tag.trim())
      : [];
  function getStarRating(rating, maxStars = 5) {
    let html = "";
    for (let i = 1; i <= maxStars; i++) {
      if (rating >= i) {
        html += "★";
      } else if (rating >= i - 0.5) {
        html += "⯪";
      } else {
        html += "☆";
      }
    }
    return html;
  }
  const brandMarkup = product.brand
    ? `<span class="meta-pill">
        Brand: ${product.brand}
      </span>`
    : "";
  block.innerHTML = `
    <div class="pdp">
      <div class="pdp-top">
        <div class="pdp-gallery">
          <img
            class="pdp-main-image"
            src="${product.thumbnail}"
            alt="${product.title}"
          />
        </div>
        <div class="pdp-info">
          <div class="pdp-meta">
            <span class="meta-pill">
              Category: ${product.category}
            </span>
            ${brandMarkup}
          </div>
          <h1>
            ${product.title}
          </h1>
          <div class="pdp-tags">
            ${
              tags
                ? tags
                    .map((tag) => `<span class="pdp-tag">${tag}</span>`)
                    .join("")
                : ""
            }
          </div>
          <div class="pdp-rating">
            ${getStarRating(product.rating)}
          </div>
          <div class="pdp-pricing">
            <span class="old-price">
              $${product.price}
            </span>
            <span class="new-price">
              $${discountedPrice}
            </span>
            <span class="discount-badge">
              (${discount}% OFF)
            </span>
          </div>
          <div class="pdp-stock">
            ✅ In Stock
            (${product.stock} available)
          </div>
          <p class="pdp-description">
            ${product.description}
          </p>
          <div
            class="pdp-cart"
            data-product-id="${product.id}"
          >
            ${
              quantity > 0
                ? `<div class="qty-controls">
                  <button class="qty-minus">
                    -
                  </button>
                  <span>${quantity}</span>
                  <button class="qty-plus">
                    +
                  </button>
                </div>`
                : `<button class="add-to-cart-btn">
                  Add To Cart
                </button>`
            }
          </div>
        </div>
      </div>
      <div class="pdp-details">
        <div class="pdp-accordion expanded">
          <button class="accordion-header">
            Product Information
          </button>
          <div class="accordion-content">
            <table>
              <tr>
                <td>Brand</td>
                <td>${product.brand}</td>
              </tr>
              <tr>
                <td>SKU</td>
                <td>${product.sku}</td>
              </tr>
              <tr>
                <td>Weight</td>
                <td>${product.weight}</td>
              </tr>
              <tr>
                <td>Stock</td>
                <td>${product.stock}</td>
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
              ${product.shippingInformation}
            </p>
            <p>
              ${product.returnPolicy}
            </p>
            <p>
              ${product.warrantyInformation}
            </p>
          </div>
        </div>
      </div>
    </div>`;

  const cartContainer = block.querySelector(".pdp-cart");
  function rerenderCart() {
    const qty = getItemQuantity(product.id);
    if (qty === 0) {
      cartContainer.innerHTML = `
        <button class="add-to-cart-btn">
          Add To Cart
        </button>`;

      cartContainer
        .querySelector(".add-to-cart-btn")
        .addEventListener("click", () => {
          addItem(product);
          rerenderCart();
        });
      return;
    }

    cartContainer.innerHTML = `
      <div class="qty-controls">
        <button class="qty-minus">-</button>
        <span>${qty}</span>
        <button class="qty-plus">+</button>
      </div>
    `;

    cartContainer.querySelector(".qty-plus").addEventListener("click", () => {
      updateQuantity(product.id, qty + 1);
      rerenderCart();
    });

    cartContainer.querySelector(".qty-minus").addEventListener("click", () => {
      updateQuantity(product.id, qty - 1);
      rerenderCart();
    });
  }
  rerenderCart();
  block.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", () => {
      header.closest(".pdp-accordion").classList.toggle("expanded");
    });
  });
}
