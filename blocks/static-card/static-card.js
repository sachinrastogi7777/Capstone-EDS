import {
  addItem,
  getItemQuantity,
  updateQuantity,
  removeItem,
} from "../../scripts/cart.js";

export default function decorate(block) {
  const products = [...block.children];
  function renderCards() {
    const cards = products.map((product) => {
      const cols = [...product.children];
      const id = cols[0]?.textContent.trim();
      const image = cols[1]?.innerHTML || "";
      const title = cols[2]?.querySelector("h3")?.textContent.trim();
      const description = cols[3]?.textContent.trim();
      const rating = cols[4]?.textContent.trim();
      const prices = cols[5]?.querySelectorAll("p");
      const price = prices?.[0]?.textContent.trim();
      let discount = Number(prices?.[1]?.textContent.trim());
      discount = Math.round(discount);
      const links = cols[6]?.querySelectorAll("a") || [];
      const addToCartText = links[0]?.textContent?.trim() || "Add To Cart";
      const viewProductLink = links[1]?.getAttribute("href") || "#";
      const viewProductText = links[1]?.textContent?.trim() || "View Product";
      const discountedPrice = (
        Number(price) *
        (1 - Number(discount) / 100)
      ).toFixed(2);

      function getStarRating(rating) {
        let html = "";
        for (let i = 1; i <= 5; i += 1) {
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

      return `
      <div class="featured-product-card">
        <div class="featured-product-image">
          ${image}
        </div>
        <div class="featured-product-content">
          <h3>
            ${title}
          </h3>
          <p class="featured-product-description">
            ${description}
          </p>
          <div class="featured-product-rating">
            ${getStarRating(rating)}
          </div>
          <div class="featured-product-pricing">
            <span class="original-price">
              $${price}
            </span>
            <span class="discount-price">
              $${discountedPrice}
            </span>
            <span class="discount-badge">
              (${discount}% OFF)
            </span>
          </div>
          <div class="product-actions">
            ${
              getItemQuantity(id) > 0
                ? `<div class="qty-controls">
                    <button
                      class="qty-minus"
                      data-product-id="${id}"
                    >
                        -
                    </button>
                    <span class="qty-value">
                      ${getItemQuantity(id)}
                    </span>
                    <button
                      class="qty-plus"
                      data-product-id="${id}"
                    >
                      +
                    </button>
                  </div>`
                : `<button
                    class="add-to-cart-btn"
                    data-product-id="${id}"
                  >
                      ${addToCartText}
                  </button>`
            }
            <a class="view-product-link" href="${viewProductLink}">
              ${viewProductText}
            </a>
          </div>
        </div>
      </div>`;
    });
    block.innerHTML = `
      <div class="category-product-grid">
        ${cards.join("")}
      </div>`;
    attachEvents();
  }

  function attachEvents() {
    block.querySelectorAll(".add-to-cart-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const card = button.closest(".featured-product-card");
        const product = {
          id: Number(button.dataset.productId),
          title: card.querySelector("h3").textContent,
          thumbnail: card.querySelector("img").src,
          price: Number(
            card.querySelector(".original-price").textContent.replace("$", ""),
          ),
          discountPercentage: Number(
            card
              .querySelector(".discount-badge")
              .textContent.replace("% OFF", "")
              .replace("(", "")
              .replace(")", ""),
          ),
        };
        addItem(product);
        renderCards();
      });
    });

    block.querySelectorAll(".qty-plus").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.productId;
        const qty = getItemQuantity(id);
        updateQuantity(id, qty + 1);
        renderCards();
      });
    });

    block.querySelectorAll(".qty-minus").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.productId;
        const qty = getItemQuantity(id);
        if (qty <= 1) {
          removeItem(id);
        } else {
          updateQuantity(id, qty - 1);
        }
        renderCards();
      });
    });
  }
  renderCards();
}
