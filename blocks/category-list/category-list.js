import createProductCard from "../../scripts/product-card.js";
import {
  addItem,
  updateQuantity,
  getItemQuantity,
} from "../../scripts/cart.js";

export default async function decorate(block) {
  const productsPerPage = parseInt(block.textContent.trim(), 10) || 12;
  block.innerHTML = `
    <div class="category-list-wrapper">
      <div class="category-header">
        <h2 class="category-title"></h2>
        <p class="category-description"></p>
      </div>
      <div class="product-grid"></div>
      <div class="pagination"></div>
    </div>`;

  const grid = block.querySelector(".product-grid");
  const pagination = block.querySelector(".pagination");
  const category = new URLSearchParams(window.location.search).get("category");

  const categoryName = category
    ? category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Products";

  block.querySelector(".category-title").textContent =
    `${categoryName} Collection`;

  block.querySelector(".category-description").textContent =
    `Discover the latest products from the ${categoryName} category.`;

  const response = await fetch("/products-list.json?sheet=data");
  const data = await response.json();
  const allProducts = data.data || [];
  const categoryProducts = allProducts.filter(
    (product) => product.category?.toLowerCase() === category?.toLowerCase(),
  );
  let currentPage = 1;
  function renderPage(page) {
    const start = (page - 1) * productsPerPage;
    const pageProducts = categoryProducts.slice(start, start + productsPerPage);
    grid.innerHTML = "";

    pageProducts.forEach((product) => {
      const card = createProductCard(product, "shop");
      const quantityWrapper = card.querySelector(".product-qty-wrapper");
      function renderQuantityUI() {
        const quantity = getItemQuantity(product.id);
        if (quantity === 0) {
          quantityWrapper.innerHTML = `
            <button class="add-to-cart-btn">
              Add To Cart
            </button>`;
          quantityWrapper
            .querySelector(".add-to-cart-btn")
            .addEventListener("click", () => {
              addItem(product);
              renderQuantityUI();
            });
        } else {
          quantityWrapper.innerHTML = `
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
          quantityWrapper
            .querySelector(".qty-plus")
            .addEventListener("click", () => {
              updateQuantity(product.id, quantity + 1);
              renderQuantityUI();
            });
          quantityWrapper
            .querySelector(".qty-minus")
            .addEventListener("click", () => {
              updateQuantity(product.id, quantity - 1);
              renderQuantityUI();
            });
        }
      }
      renderQuantityUI();
      grid.append(card);
    });
    renderPagination();
  }

  function renderPagination() {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(categoryProducts.length / productsPerPage);
    if (totalPages <= 1) {
      return;
    }
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Prev";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage -= 1;
        renderPage(currentPage);
      }
    });
    pagination.append(prevBtn);
    for (let i = 1; i <= totalPages; i += 1) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) {
        btn.classList.add("active");
      }
      btn.addEventListener("click", () => {
        currentPage = i;
        renderPage(currentPage);
      });
      pagination.append(btn);
    }
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage += 1;
        renderPage(currentPage);
      }
    });
    pagination.append(nextBtn);
  }
  renderPage(currentPage);
}
