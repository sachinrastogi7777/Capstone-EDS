import {
  addItem,
  getItemQuantity,
  updateQuantity,
  removeItem,
} from "../../scripts/cart.js";

export default function decorate(block) {
  const rows = [...block.children];
  const data = {};
  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) {
      return;
    }
    const key = cols[0].textContent.trim();
    data[key] = cols[1];
  });

  const productId = data["Product Id"]?.textContent.trim();
  const title = data["Title"]?.textContent.trim();
  const description = data["Description"]?.textContent.trim();
  const category = data["Category"]?.textContent.trim();
  const brand = data["Brand"]?.textContent.trim();
  const tags =
    data["Tags"]?.textContent.split(",").map((tag) => tag.trim()) || [];
  const rating = Number(data["Rating"]?.textContent.trim());
  const price = Number(data["Price"]?.textContent.trim());
  const discount = Math.round(Number(data["Discount"]?.textContent.trim()));
  console.log(discount);
  const stock = Number(data["Stock"]?.textContent.trim());
  const image = data["Image"]?.innerHTML || "";
  const discountedPrice = (price * (1 - discount / 100)).toFixed(2);

  function getStarRating(value) {
    let html = "";
    for (let i = 1; i <= 5; i += 1) {
      if (value >= i) {
        html += "★";
      } else if (value >= i - 0.5) {
        html += "⯪";
      } else {
        html += "☆";
      }
    }
    return html;
  }

  block.innerHTML = `
    <div class="pdp-static">
      <div class="pdp-top">
        <div class="pdp-gallery">
          ${image}
        </div>
        <div class="pdp-info">
          <div class="pdp-meta">
            <span class="meta-pill">
              Category: ${category}
            </span>
            <span class="meta-pill">
              Brand: ${brand}
            </span>
          </div>
          <h1>${title}</h1>
          <div class="pdp-tags">
            ${tags
              .map(
                (tag) => `
                  <span class="pdp-tag">
                    ${tag}
                  </span>`,
              )
              .join("")}
          </div>
          <div class="pdp-rating">
            ${getStarRating(rating)}
          </div>
          <div class="pdp-pricing">
            <span class="old-price">
              $${price}
            </span>
            <span class="new-price">
              $${discountedPrice}
            </span>
            <span class="discount-badge">
              (${discount}% OFF)
            </span>
          </div>
          <div class="pdp-stock">
            ✅ In Stock (${stock} available)
          </div>
          <p class="pdp-description">
            ${description}
          </p>
          <div
            class="pdp-cart"
            data-product-id="${productId}"
          ></div>
        </div>
      </div>
    </div>`;

  const product = {
    id: Number(productId),
    title,
    thumbnail: block.querySelector("img")?.src,
    price,
    discountPercentage: discount,
  };

  const cartContainer = block.querySelector(".pdp-cart");
  function rerenderCart() {
    const qty = getItemQuantity(productId);
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
        <button class="qty-minus">
          -
        </button>
        <span>
          ${qty}
        </span>
        <button class="qty-plus">
          +
        </button>
      </div>`;

    cartContainer.querySelector(".qty-plus").addEventListener("click", () => {
      updateQuantity(productId, qty + 1);
      rerenderCart();
    });

    cartContainer.querySelector(".qty-minus").addEventListener("click", () => {
      if (qty <= 1) {
        removeItem(productId);
      } else {
        updateQuantity(productId, qty - 1);
      }
      rerenderCart();
    });
  }
  rerenderCart();
}
