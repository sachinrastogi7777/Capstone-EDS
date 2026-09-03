export default function decorate(block) {
  const imageRow = block.querySelector(":scope > div");
  const pictures = [...imageRow.querySelectorAll("picture")];
  const slider = document.createElement("div");
  slider.className = "hero-slider";
  pictures.forEach((picture, index) => {
    const slide = document.createElement("div");
    slide.className = "hero-slide";
    if (index === 0) {
      slide.classList.add("active");
    }
    slide.append(picture);
    slider.append(slide);
  });

  imageRow.replaceWith(slider);
  const rows = [...block.children];
  const content = document.createElement("div");
  content.className = "hero-content";
  rows.slice(1).forEach((row) => {
    content.append(row);
  });
  block.append(content);
  const links = block.querySelectorAll("a");
  links.forEach((link) => {
    link.classList.add("button", "primary");
    const p = link.closest("p");
    if (p) {
      p.classList.add("button-wrapper");
    }
  });

  const dotsWrapper = document.createElement("div");
  dotsWrapper.className = "hero-dots";
  const prevBtn = document.createElement("button");
  prevBtn.className = "hero-nav hero-prev";
  prevBtn.innerHTML = "&#10094;";
  const nextBtn = document.createElement("button");
  nextBtn.className = "hero-nav hero-next";
  nextBtn.innerHTML = "&#10095;";
  block.append(prevBtn);
  block.append(nextBtn);
  pictures.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "hero-dot";
    if (index === 0) {
      dot.classList.add("active");
    }
    dot.addEventListener("click", () => {
      showSlide(index);
    });
    dotsWrapper.append(dot);
  });
  block.append(dotsWrapper);
  const slides = block.querySelectorAll(".hero-slide");
  const dots = block.querySelectorAll(".hero-dot");
  let currentSlide = 0;
  function showSlide(index) {
    slides[currentSlide].classList.remove("active");
    dots[currentSlide].classList.remove("active");
    currentSlide = index;
    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
  }

  prevBtn.addEventListener("click", () => {
    const index = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(index);
  });

  nextBtn.addEventListener("click", () => {
    const index = (currentSlide + 1) % slides.length;
    showSlide(index);
  });

  setInterval(() => {
    const index = (currentSlide + 1) % slides.length;
    showSlide(index);
  }, 5000);
}
