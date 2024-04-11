import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  block.textContent = '';

  const footerPath = footerMeta.footer || '/drafts/sam/footer-jp';
  const fragment = await loadFragment(footerPath);

  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Find the div for copyright and "All Rights Reserved"
  const copyrightDiv = footer.querySelector('.footer-copyright-wrapper > div > div');

  copyrightDiv?.classList.add('copyright-flex-container');

  // Create a new container for legal and copyright sections
  const legalCopyrightContainer = document.createElement('div');
  legalCopyrightContainer.classList.add('legal-copyright-container');

  // Append existing legal and copyright sections to the new container
  const footerLegal = footer.querySelector('.footer-legal-wrapper');
  const footerCopyright = footer.querySelector('.footer-copyright-wrapper');
  if (footerLegal && footerCopyright) {
    legalCopyrightContainer.append(footerLegal, footerCopyright);
    footer.append(legalCopyrightContainer); // Append the new container to the footer
  }

  block.append(footer);
}
