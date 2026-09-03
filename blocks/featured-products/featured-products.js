import createProductCard from "../../scripts/product-card.js";

export default async function decorate(block) {
  const limit = parseInt(block.textContent.trim(), 10) || 8;
  block.innerHTML = `
    <div class="featured-products-wrapper">
      <button
        class="featured-nav-btn featured-prev"
        aria-label="Previous Products"
      >
        ←
      </button>
      <div class="featured-products-grid"></div>
      <button
        class="featured-nav-btn featured-next"
        aria-label="Next Products"
      >
        →
      </button>
    </div>`;

  const grid = block.querySelector(".featured-products-grid");
  const prevBtn = block.querySelector(".featured-prev");
  const nextBtn = block.querySelector(".featured-next");

  try {
    const response = await fetch("/products-list.json?sheet=data");
    const data = await response.json();
    const products = data.data || [];
    const featuredProducts = [...products]
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
    const isMobile = window.innerWidth < 768;
    function renderProducts(items) {
      grid.innerHTML = "";
      items.forEach((product) => {
        grid.append(createProductCard(product));
      });
    }
    if (isMobile) {
      renderProducts(featuredProducts);
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
      return;
    }

    let currentPage = 0;
    const productsPerPage = 4;
    function updateSlider() {
      const start = currentPage * productsPerPage;
      const pageProducts = featuredProducts.slice(
        start,
        start + productsPerPage,
      );
      renderProducts(pageProducts);
      prevBtn.disabled = currentPage === 0;
      nextBtn.disabled = start + productsPerPage >= featuredProducts.length;
    }

    prevBtn.addEventListener("click", () => {
      if (currentPage > 0) {
        currentPage -= 1;
        updateSlider();
      }
    });

    nextBtn.addEventListener("click", () => {
      if ((currentPage + 1) * productsPerPage < featuredProducts.length) {
        currentPage += 1;
        updateSlider();
      }
    });

    updateSlider();
  } catch (error) {
    console.error(error);
    grid.innerHTML = `<p>Unable to load featured products.</p>`;
  }
}
