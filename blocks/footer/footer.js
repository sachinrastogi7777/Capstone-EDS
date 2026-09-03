import { getMetadata } from "../../scripts/aem.js";
import { loadFragment } from "../fragment/fragment.js";

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */

export default async function decorate(block) {
  if (window.__footerLoaded) {
    return;
  }
  window.__footerLoaded = true;
  const footerMeta = getMetadata("footer");
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : "/footer";
  const fragment = await loadFragment(footerPath);
  console.log(fragment);
  console.log(fragment.innerHTML);
  if (!fragment) return;
  block.textContent = "";
  const footer = document.createElement("div");
  while (fragment.firstElementChild) {
    footer.append(fragment.firstElementChild);
  }
  const rows = footer.querySelectorAll(".footer.block > div");
  const values = [...rows].map((row) => {
    const cols = row.querySelectorAll("div");
    return {
      left: cols[0]?.textContent.trim(),
      right: cols[1]?.textContent.trim(),
    };
  });
  const wrapper = document.createElement("div");
  wrapper.className = "footer-layout";
  wrapper.innerHTML = `
  <div class="footer-left">
    <h3>${values[0].left}</h3>
    <p>${values[0].right}</p>
    <p>${values[1].right}</p>
    <div class="footer-social-links">
      <span>${values[2].right}</span>
      <span>${values[3].right}</span>
      <span>${values[4].right}</span>
      <span>${values[5].right}</span>
    </div>
  </div>
  <div class="footer-right">
    <div class="footer-column">
      <h4>${values[6].left}</h4>
      <ul>
        <li>${values[6].right}</li>
        <li>${values[7].right}</li>
        <li>${values[8].right}</li>
      </ul>
    </div>
    <div class="footer-column">
      <h4>${values[9].left}</h4>
      <ul>
        <li>${values[9].right}</li>
        <li>${values[10].right}</li>
        <li>${values[11].right}</li>
      </ul>
    </div>
    <div class="footer-column">
      <h4>${values[12].left}</h4>
      <ul>
        <li>${values[12].right}</li>
        <li>${values[13].right}</li>
        <li>${values[14].right}</li>
      </ul>
    </div>
  </div>`;
  const copyrightDiv = document.createElement("div");
  copyrightDiv.className = "footer-copyright";
  copyrightDiv.textContent = values[15].right;
  footer.innerHTML = "";
  footer.append(wrapper);
  footer.append(copyrightDiv);
  block.append(footer);
}
