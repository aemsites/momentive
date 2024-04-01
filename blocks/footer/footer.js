import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  console.log('decorating footer', block);
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
    const nextUl = h3.nextElementSibling?.tagName === 'UL' ? h3.nextElementSibling : null;

    const wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add('footer-column');

    wrapperDiv.appendChild(h3);
    if (nextUl) {
      wrapperDiv.appendChild(nextUl);
      h3.classList.add('toggle');
      nextUl.classList.add('hidden'); // Initially hide the `ul` elements

      // Event listener for toggling visibility and ensuring only one dropdown is open at a time
      h3.addEventListener('click', () => {
        const isExpanded = nextUl.classList.toggle('expanded');
        h3.classList.toggle('expanded', isExpanded); // Toggle class on `h3` for icon rotation
        nextUl.classList.toggle('hidden');

        // Close any currently open dropdowns
        const expandedSections = footer.querySelectorAll('.footer-column ul.expanded');
        expandedSections.forEach((e) => {
          if (e !== nextUl) {
            e.classList.remove('expanded');
            e.previousElementSibling.classList.remove('expanded'); // Remove 'expanded' from `h3` as well
            e.classList.add('hidden');
          }
        });
      });
    }

    footerMain.appendChild(wrapperDiv);
  });

  // Container for footer-social and footer-languages
  const socialLanguagesContainer = document.createElement('div');
  socialLanguagesContainer.classList.add('footer-social-row');

  const footerSocial = footer.querySelector('.footer-social-wrapper');
  const footerLanguages = footer.querySelector('.footer-languages-wrapper');

  socialLanguagesContainer.appendChild(footerSocial);
  socialLanguagesContainer.appendChild(footerLanguages);
  section.appendChild(socialLanguagesContainer);

  const sublinksContentContainer = document.createElement('div');
  sublinksContentContainer.classList.add('footer-sublinks-row');
  const footerSublinks = footer.querySelector('.footer-sublinks-wrapper');
  sublinksContentContainer.appendChild(footerSublinks);
  section.appendChild(sublinksContentContainer);

  block.append(footer);
}
