import createProductCard from "../../scripts/product-card.js";
import { loadFragment } from "../fragment/fragment.js";
import {
  addItem,
  updateQuantity,
  getItemQuantity,
} from "../../scripts/cart.js";

export default async function decorate(block) {
  let activeFilters = {
    categories: [],
    minPrice: 0,
    maxPrice: Infinity,
    rating: 0,
  };
  let allProducts = [];
  let filteredProducts = [];
  const productsPerPage = parseInt(block.textContent.trim(), 10) || 20;
  block.innerHTML = `
  <div class="product-list-layout">
    <aside class="product-filters"></aside>
    <div class="product-content">
      <div class="product-grid"></div>
      <div class="pagination"></div>
    </div>
  </div>`;

  const grid = block.querySelector(".product-grid");
  const pagination = block.querySelector(".pagination");
  const filtersContainer = block.querySelector(".product-filters");

  let currentPage = 1;
  let totalProducts = 0;

  async function getAllProducts() {
    const cachedProducts = localStorage.getItem("all-products");
    if (cachedProducts) {
      return JSON.parse(cachedProducts);
    }
    const response = await fetch("/products-list.json?sheet=data");
    const data = await response.json();
    const products = data.data || [];
    localStorage.setItem("all-products", JSON.stringify(products));
    return products;
  }

  async function loadFilters() {
    const filtersFragment = await loadFragment("/fragments/filters");
    while (filtersFragment.firstElementChild) {
      filtersContainer.append(filtersFragment.firstElementChild);
    }
    const headings = [...filtersContainer.querySelectorAll("h3")];
    headings.forEach((heading) => {
      const wrapper = document.createElement("div");
      wrapper.className = "filter-section";
      heading.parentNode.insertBefore(wrapper, heading);
      wrapper.appendChild(heading);
      const content = document.createElement("div");
      content.className = "filter-content";
      wrapper.appendChild(content);
    });
    const categoriesSection = headings.find(
      (heading) => heading.textContent.trim() === "Categories",
    );

    const priceSection = headings.find(
      (heading) => heading.textContent.trim() === "Price Range",
    );
    if (priceSection) {
      const priceWrapper =
        priceSection.parentElement.querySelector(".filter-content");
      priceWrapper.classList.add("price-filter");
      priceWrapper.innerHTML = `
        <input
          type="range"
          id="priceRange"
          min="0"
          max="10000"
          value="10000"
        />
        <div class="price-value">
          $0 - $10000
        </div>`;
      const priceRange = priceWrapper.querySelector("#priceRange");
      priceRange.addEventListener("input", (e) => {
        priceWrapper.querySelector(".price-value").textContent =
          `$0 - $${e.target.value}`;
      });
    }

    const ratingSection = headings.find(
      (heading) => heading.textContent.trim() === "Rating",
    );
    if (ratingSection) {
      const ratingWrapper =
        ratingSection.parentElement.querySelector(".filter-content");
      ratingWrapper.classList.add("rating-filter");
      ratingWrapper.innerHTML = `
        <label>
          <input type="radio" name="rating" value="4" />
          4★ & above
        </label>
        <label>
          <input type="radio" name="rating" value="3" />
          3★ & above
        </label>
        <label>
          <input type="radio" name="rating" value="2" />
          2★ & above
        </label>`;
    }
    if (categoriesSection) {
      const categoriesWrapper =
        categoriesSection.parentElement.querySelector(".filter-content");
      categoriesWrapper.classList.add("categories-filter");
      console.log(categoriesWrapper);
      return categoriesWrapper;
    }
    return null;
  }

  async function loadCategories(categoriesWrapper) {
    try {
      const response = await fetch("/products-list.json?sheet=categories");
      const data = await response.json();
      const categories = data.data || [];
      console.log(categories);
      categories.forEach((category) => {
        const item = document.createElement("div");
        item.className = "filter-category";
        item.innerHTML = `
          <label class="filter-checkbox">
            <input
              type="checkbox"
              value="${category.categories.toLowerCase()}"
            />
            <span>
              ${category.categories
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </span>
          </label>`;
        categoriesWrapper.append(item);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function loadProducts(page = 1) {
    const offset = (page - 1) * productsPerPage;
    try {
      const response = await fetch(
        `/products-list.json?sheet=data&limit=${productsPerPage}&offset=${offset}`,
      );
      const data = await response.json();
      const products = data.data || [];
      totalProducts = Number(data.total) || 0;
      renderProducts(products);
      renderPagination();
    } catch (error) {
      console.error(error);
      grid.innerHTML = "<p>Unable to load products.</p>";
    }
  }

  function renderProducts(products) {
    grid.innerHTML = "";
    products.forEach((product) => {
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
  }

  function renderFilteredPagination() {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (totalPages <= 1) {
      return;
    }

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Prev";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage -= 1;
        renderFilteredPage();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    });
    pagination.append(prevBtn);
    for (let i = 1; i <= totalPages; i += 1) {
      const pageBtn = document.createElement("button");
      pageBtn.textContent = i;
      if (i === currentPage) {
        pageBtn.classList.add("active");
      }
      pageBtn.addEventListener("click", () => {
        currentPage = i;
        renderFilteredPage();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
      pagination.append(pageBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage += 1;
        renderFilteredPage();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    });
    pagination.append(nextBtn);
  }

  function renderFilteredPage() {
    const start = (currentPage - 1) * productsPerPage;
    const pageData = filteredProducts.slice(start, start + productsPerPage);
    renderProducts(pageData);
    renderFilteredPagination();
  }

  function renderPagination() {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    if (totalPages <= 1) {
      return;
    }
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Prev";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", async () => {
      if (currentPage > 1) {
        currentPage -= 1;
        await loadProducts(currentPage);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    });
    pagination.append(prevBtn);
    for (let i = 1; i <= totalPages; i += 1) {
      const pageBtn = document.createElement("button");
      pageBtn.textContent = i;
      if (i === currentPage) {
        pageBtn.classList.add("active");
      }
      pageBtn.addEventListener("click", async () => {
        currentPage = i;
        await loadProducts(currentPage);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
      pagination.append(pageBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", async () => {
      if (currentPage < totalPages) {
        currentPage += 1;
        await loadProducts(currentPage);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    });
    pagination.append(nextBtn);
  }

  const categoriesWrapper = await loadFilters();
  if (window.innerWidth <= 768) {
    filtersContainer.classList.add("collapsed");
    const filtersHeading = filtersContainer.querySelector("h2");
    if (filtersHeading) {
      filtersHeading.classList.add("mobile-filter-heading");
      filtersHeading.addEventListener("click", () => {
        filtersContainer.classList.toggle("collapsed");
      });
    }
  }

  filtersContainer.querySelectorAll("h3, h4").forEach((heading) => {
    heading.classList.add("filter-heading");
    const section = heading.closest(".filter-section");
    heading.addEventListener("click", () => {
      section?.classList.toggle("expanded");
    });
  });
  if (categoriesWrapper) {
    await loadCategories(categoriesWrapper);
    restoreFilters();
    allProducts = await getAllProducts();
  }

  function collectFilters() {
    const selectedCategories = [
      ...filtersContainer.querySelectorAll(".filter-category input:checked"),
    ].map((checkbox) => checkbox.value);
    activeFilters.categories = selectedCategories;
    const ratingInput = filtersContainer.querySelector(
      'input[name="rating"]:checked',
    );
    activeFilters.rating = ratingInput ? Number(ratingInput.value) : 0;
    const priceRange = document.querySelector("#priceRange");
    activeFilters.maxPrice = priceRange ? Number(priceRange.value) : Infinity;
  }

  function restoreFilters() {
    const savedFilters = localStorage.getItem("active-filters");
    if (!savedFilters) {
      return;
    }
    activeFilters = JSON.parse(savedFilters);
    const checkboxes = filtersContainer.querySelectorAll(
      '.filter-category input[type="checkbox"]',
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = activeFilters.categories.includes(checkbox.value);
    });
    const ratingInput = filtersContainer.querySelector(
      `input[name="rating"][value="${activeFilters.rating}"]`,
    );
    if (ratingInput) {
      ratingInput.checked = true;
    }
    const priceRange = filtersContainer.querySelector("#priceRange");
    if (priceRange) {
      priceRange.value = activeFilters.maxPrice;
      const priceValue = filtersContainer.querySelector(".price-value");
      if (priceValue) {
        priceValue.textContent = `$0 - $${activeFilters.maxPrice}`;
      }
    }
  }

  function applyFilters(skipCollect = false) {
    if (!skipCollect) {
      collectFilters();
    }
    localStorage.setItem("active-filters", JSON.stringify(activeFilters));
    filteredProducts = [...allProducts];
    if (activeFilters.categories.length) {
      filteredProducts = filteredProducts.filter((product) =>
        activeFilters.categories.includes(product.category?.toLowerCase()),
      );
    }
    filteredProducts = filteredProducts.filter(
      (product) => Number(product.price) <= activeFilters.maxPrice,
    );
    filteredProducts = filteredProducts.filter(
      (product) => Number(product.rating) >= activeFilters.rating,
    );
    currentPage = 1;
    console.log("Total Products", allProducts.length);
    console.log("Filtered Products:", filteredProducts.length);
    renderFilteredPage();
  }

  const applyBtn = document.createElement("button");
  applyBtn.addEventListener("click", async () => {
    allProducts = await getAllProducts();
    applyFilters();
  });
  applyBtn.className = "apply-filters-btn";
  applyBtn.textContent = "Apply Filters";
  filtersContainer.append(applyBtn);

  const clearBtn = document.createElement("button");
  clearBtn.addEventListener("click", async () => {
    localStorage.removeItem("active-filters");
    activeFilters = {
      categories: [],
      minPrice: 0,
      maxPrice: Infinity,
      rating: 0,
    };
    filtersContainer
      .querySelectorAll(".filter-category input")
      .forEach((checkbox) => {
        checkbox.checked = false;
      });
    filtersContainer
      .querySelectorAll('input[name="rating"]')
      .forEach((radio) => {
        radio.checked = false;
      });
    const priceRange = filtersContainer.querySelector("#priceRange");
    if (priceRange) {
      priceRange.value = 10000;
    }
    const priceValue = filtersContainer.querySelector(".price-value");

    if (priceValue) {
      priceValue.textContent = "$0 - $10000";
    }
    localStorage.removeItem("active-filters");
    currentPage = 1;
    filteredProducts = [];
    await loadProducts(currentPage);
  });
  clearBtn.className = "clear-filters-btn";
  clearBtn.textContent = "Clear Filters";
  filtersContainer.append(clearBtn);

  const savedFilters = localStorage.getItem("active-filters");

  if (savedFilters) {
    allProducts = await getAllProducts();
    restoreFilters();
    applyFilters(true);
  } else {
    await loadProducts(currentPage);
  }
}
