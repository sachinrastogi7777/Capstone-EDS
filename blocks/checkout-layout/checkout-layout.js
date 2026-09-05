export default function decorate(block) {
  const currentSection = block.closest(".section");
  const orderSummarySection = currentSection.nextElementSibling;
  const checkoutFormSection = orderSummarySection.nextElementSibling;
  const layout = document.createElement("div");
  layout.className = "checkout-layout";
  layout.appendChild(orderSummarySection);
  layout.appendChild(checkoutFormSection);
  currentSection.appendChild(layout);
}
