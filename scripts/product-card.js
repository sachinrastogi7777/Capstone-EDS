export default function createProductCard(product) {
  const card = document.createElement("div");
  const shortDescription =
    product.description.length > 80
      ? `${product.description.substring(0, 80)}...`
      : product.description;
  const discount = Math.round(product.discountPercentage);

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
        ⭐ ${product.rating}
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
      <a
        href="/product?id=${product.id}"
        class="featured-product-link"
      >
        View Product
      </a>
    </div>`;
  return card;
}
