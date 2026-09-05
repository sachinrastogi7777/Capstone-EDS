import { getItemQuantity } from "./cart.js";

export default function createProductCard(product, mode) {
  const quantity = getItemQuantity(product.id);
  const card = document.createElement("div");
  const shortDescription =
    product.description.length > 80
      ? `${product.description.substring(0, 80)}...`
      : product.description;
  const discount = Math.round(product.discountPercentage);
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
  let action = "";
  if (mode === "home") {
    action = `
      <a
        href="/product-desc?id=${product.id}"
        class="featured-product-link"
      >
        View Product
      </a>`;
  } else if (mode === "shop") {
    const quantityMarkup =
      quantity > 0
        ? `<div class="qty-controls">
            <button class="qty-minus">
              -
            </button>
            <span class="qty-value">
              ${quantity}
            </span>
            <button class="qty-plus">
              +
            </button>
          </div>`
        : `<button
            class="add-to-cart-btn"
            data-product-id="${product.id}"
          >
              Add To Cart
          </button>`;
    action = `
      <div class="product-actions">
        <div
          class="product-qty-wrapper"
          data-product-id="${product.id}"
        >
          ${quantityMarkup}
        </div>
        <a
          href="/product-desc?id=${product.id}"
          class="featured-product-link"
        >
          View Product
        </a>
      </div>`;
  }
  const discountedPrice = (product.price * (1 - discount / 100)).toFixed(2);
  card.className = "featured-product-card";
  card.innerHTML = `
    <div class="featured-product-image">
      <img src="${product.thumbnail}" alt="${product.title}"/>
    </div>
    <div class="featured-product-content">
      <h3>
        ${product.title}
      </h3>
      <p class="featured-product-description">
        ${shortDescription}
      </p>
      <div class="featured-product-rating">
        ${getStarRating(product.rating)}
      </div>
      <div class="featured-product-pricing">
        <span class="original-price">
          $${product.price}
        </span>
        <span class="discount-price">
          $${discountedPrice}
        </span>
        <span class="discount-badge">
          (${discount}% OFF)
        </span>
      </div>
      ${action}
    </div>`;
  return card;
}
