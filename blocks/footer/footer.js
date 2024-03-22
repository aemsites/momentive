import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  block.textContent = '';

  const footerPath = footerMeta.footer || '/footer';
  const fragment = await loadFragment(footerPath);

  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Directly select the .footer-main container to append the columns to
  const footerMain = footer.querySelector('.footer-main');
  const section = footer.querySelector('.section');

  // Find each <h3> within .footer-main
  const mainSections = footerMain.querySelectorAll('h3');
  mainSections.forEach((h3) => {
    // Identify the next <ul> before any changes
    const nextUl = h3.nextElementSibling && h3.nextElementSibling.tagName === 'UL'
      ? h3.nextElementSibling
      : null;

    // Create the wrapper and append <h3>
    const wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add('footer-column');

    // Remove the <h3> and <ul> from their current parent and append them to the wrapper
    wrapperDiv.appendChild(h3);
    if (nextUl) {
      wrapperDiv.appendChild(nextUl);
    }

    // Append the wrapper div directly to .footer-main
    footerMain.appendChild(wrapperDiv);
  });

  // Create a container for footer-social and footer-languages
  const socialLanguagesContainer = document.createElement('div');
  socialLanguagesContainer.classList.add('footer-social-row');

  // Select footer-social and footer-languages
  const footerSocial = footer.querySelector('.footer-social-wrapper');
  const footerLanguages = footer.querySelector('.footer-languages-wrapper');

  // Append footer-social and footer-languages to the container
  socialLanguagesContainer.appendChild(footerSocial);
  socialLanguagesContainer.appendChild(footerLanguages);

  section.appendChild(socialLanguagesContainer);

  const sublinksContentContainer = document.createElement('div');
  sublinksContentContainer.classList.add('footer-sublinks-row');

  const footerSublinks = footer.querySelector('.footer-sublinks-wrapper');
  const defaultContent = footer.querySelector('.default-content-wrapper');

  sublinksContentContainer.appendChild(footerSublinks);
  sublinksContentContainer.appendChild(defaultContent);

  section.appendChild(sublinksContentContainer);

  block.append(footer);
}
