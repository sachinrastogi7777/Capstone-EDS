export default async function decorate(block) {
  const limit = parseInt(block.textContent.trim(), 10) || 24;
  block.innerHTML = `
    <div class="category-cards-wrapper">
      <button
        class="category-nav-btn category-prev"
        aria-label="Previous Categories">
        ←
      </button>
      <div class="category-cards-grid"></div>
      <button
        class="category-nav-btn category-next"
        aria-label="Next Categories">
        →
      </button>
    </div>`;

  const grid = block.querySelector(".category-cards-grid");
  const prevBtn = block.querySelector(".category-prev");
  const nextBtn = block.querySelector(".category-next");

  try {
    const response = await fetch("/products-list.json?sheet=categories");
    const json = await response.json();
    const categories = (json.data || []).slice(0, limit);
    const isMobile = window.innerWidth <= 768;
    function createCard(category) {
      const card = document.createElement("a");
      card.className = "category-card";
      card.href = category.link || "#";
      const categoryName = category.categories
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      card.innerHTML = `
        <div class="category-card-image">
          <img src="${category.image}" alt="${category.categories}"/>
        </div>
        <div class="category-card-content">
          <h3>${categoryName}</h3>
          <span class="category-card-cta">
            View Category
          </span>
        </div>
      `;

      return card;
    }

    function renderCategories(items) {
      grid.innerHTML = "";

      items.forEach((category) => {
        grid.append(createCard(category));
      });
    }

    if (isMobile) {
      renderCategories(categories);

      prevBtn.style.display = "none";
      nextBtn.style.display = "none";

      return;
    }

    let currentPage = 0;
    const categoriesPerPage = 4;

    function updateSlider() {
      const start = currentPage * categoriesPerPage;

      const pageData = categories.slice(start, start + categoriesPerPage);

      renderCategories(pageData);

      prevBtn.disabled = currentPage === 0;

      nextBtn.disabled = start + categoriesPerPage >= categories.length;
    }

    prevBtn.addEventListener("click", () => {
      if (currentPage > 0) {
        currentPage -= 1;
        updateSlider();
      }
    });

    nextBtn.addEventListener("click", () => {
      if ((currentPage + 1) * categoriesPerPage < categories.length) {
        currentPage += 1;
        updateSlider();
      }
    });

    updateSlider();
  } catch (error) {
    console.error(error);

    grid.innerHTML = `
      <p>Unable to load categories.</p>
    `;
  }
}
