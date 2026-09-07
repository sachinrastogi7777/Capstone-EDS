export default function decorate(block) {
  const rows = [...block.children];
  const picture = rows[0]?.children[0]?.querySelector("picture");
  const title = rows[0]?.children[1]?.textContent.trim();
  const description = rows[1]?.children[1]?.textContent.trim();
  const link = rows[2]?.children[1]?.querySelector("a");
  block.innerHTML = "";
  const banner = document.createElement("div");
  banner.className = "promo-banner-wrapper";
  if (picture) {
    banner.append(picture);
  }
  const overlay = document.createElement("div");
  overlay.className = "promo-banner-overlay";

  const content = document.createElement("div");
  content.className = "promo-content";

  const heading = document.createElement("h2");
  heading.textContent = title;

  const ticker = document.createElement("div");
  ticker.className = "promo-ticker";

  ticker.innerHTML = `
  <div class="promo-ticker-track">
    <span>${description}</span>
    <span>${description}</span>
  </div>
`;

  content.append(heading);
  content.append(ticker);

  if (link) {
    link.classList.add("button", "primary");
    content.append(link);
  }

  overlay.append(content);
  banner.append(overlay);
  block.append(banner);
}
