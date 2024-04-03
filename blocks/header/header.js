import {
	createElement,
	fetchPlaceholders,
	getMetadata
} from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const LOGO_SRC = '/images/mpm_logo_white_color_v_tag_long_sml.png';
const LOGIN_URL = 'https://www.momentive.com/en-us/login';
const SEARCH_URL = '#';
const TRANSLATE_LANGUAGES = ['zh-cn', 'de-de', 'ja-jp', 'pt-br', 'es-mx', 'ko-kr'];
const TRANSLATE_LANG_NAMES = ['中文', 'Deutsch', '日本語', 'Português', 'Español', '한국어'];

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function isMouseInsideSecondaryNav(secondaryNav, event) {
  const secondaryNavRect = secondaryNav.getBoundingClientRect();
  const secondaryNavMarginTop = 16;
  return (
    event.clientX >= secondaryNavRect.left
    && event.clientX <= secondaryNavRect.right
    && event.clientY >= (secondaryNavRect.top - secondaryNavMarginTop)
    && event.clientY <= secondaryNavRect.bottom
  );
}

function togglePrimaryNavForMobView(nav) {
  const navPrimary = nav.querySelector('.nav-primary[data-view="mobile"]');
  const expanded = nav.getAttribute('aria-expanded') === 'true';
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  navPrimary.setAttribute('aria-expanded', expanded ? 'false' : 'true');
}

function toggleSecondaryNavForMobView(nav, item, index, listItems) {
  if (isDesktop.matches) return;

  const secondaryNavSelector = `.nav-secondary[data-position-mobile="${index + 1}"]`;
  const secondaryNav = nav.querySelector(secondaryNavSelector);
  if (secondaryNav === null) return;
  const expanded = item.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
  item.setAttribute('aria-expanded', expanded);

  if (expanded === 'true') {
    // If 'aria-expanded' is 'true', hide the other list items
    listItems.forEach((siblingItem) => {
      if (siblingItem !== item) {
        siblingItem.style.display = 'none';
      }
    });
    secondaryNav.style.display = 'block';
  } else {
    // If 'aria-expanded' is 'false', display all list items
    listItems.forEach((siblingItem) => {
      siblingItem.style.display = 'block';
    });
    secondaryNav.style.display = 'none';
  }
  secondaryNav.setAttribute('aria-expanded', expanded);
}

function toggleSecondaryNavForDesktop(nav, item, index, event) {
  const secondaryNav = nav.querySelector(`.nav-secondary[data-position-desktop="${index + 1}"]`);
  if (secondaryNav === null) return;
  const expanded = secondaryNav.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
  if (expanded === 'false') {
    if (isMouseInsideSecondaryNav(secondaryNav, event)) return;
    secondaryNav.setAttribute('aria-expanded', 'false');
  } else {
    const secondaryNavClasses = Array.from(secondaryNav.classList);
    if (!secondaryNavClasses.includes('nav-secondary-products')
      && !secondaryNavClasses.includes('nav-secondary-order-products')) {
      // Set the left position of secondaryNav relative to hoveredListItem
      const primaryNavListItems = nav.querySelectorAll('.nav-primary[data-view="desktop"] ol li');
      const hoveredListItem = primaryNavListItems[index];
      const hoveredListItemRect = hoveredListItem.getBoundingClientRect();
      const leftPosition = hoveredListItemRect.left;
      secondaryNav.style.marginLeft = `${leftPosition}px`;
    }
    // Open the secondaryNav
    secondaryNav.setAttribute('aria-expanded', 'true');
  }
}

function addEventsToNavListItems(nav) {
  if (isDesktop.matches) {
    const listItems = nav.querySelectorAll('.nav-primary[data-view="desktop"] ol li');
    listItems.forEach((item, index) => {
      const mouseHoverListenersAdded = item.getAttribute('data-mouse-hover-listener-added') || 'false';
      if (mouseHoverListenersAdded === 'false') {
        item.addEventListener('mouseenter', (event) => {
          toggleSecondaryNavForDesktop(nav, item, index, event);
        });
        item.addEventListener('mouseout', (event) => {
          toggleSecondaryNavForDesktop(nav, item, index, event);
        });
        item.setAttribute('data-mouse-hover-listener-added', 'true');
      }

      // Close the secondary nav when mouse leaves the secondaryNav
      const secondaryNav = nav.querySelector(`.nav-secondary[data-position-desktop="${index + 1}"]`);
      if (secondaryNav === null) return;
      const mouseLeaveListenerAdded = secondaryNav.getAttribute('data-mouse-leave-listener-added') || 'false';
      if (mouseLeaveListenerAdded === 'false') {
        secondaryNav.addEventListener('mouseleave', () => {
          secondaryNav.setAttribute('aria-expanded', 'false');
        });
        secondaryNav.setAttribute('data-mouse-leave-listener-added', 'true');
      }
    });
  } else {
    const listItems = nav.querySelectorAll('.nav-primary[data-view="mobile"] ol li');
    listItems.forEach((item, index) => {
      const clickListenerAdded = item.getAttribute('data-clk-listener-added') || 'false';
      if (clickListenerAdded === 'false') {
        item.addEventListener('click', () => {
          toggleSecondaryNavForMobView(nav, item, index, listItems);
        });
        item.setAttribute('data-clk-listener-added', 'true');
      }
    });
  }
}

function updatePrimaryNavVisibilityByViewType(nav) {
  const primaryNavMob = nav.querySelector('.nav-primary[data-view="mobile"]');
  const primaryNavDesktop = nav.querySelector('.nav-primary[data-view="desktop"]');
  if (isDesktop.matches) {
    primaryNavDesktop.style.display = 'block';
    primaryNavMob.style.display = 'none';
  } else {
    primaryNavMob.style.display = 'block';
    primaryNavDesktop.style.display = 'none';
  }
}

function applyCustomStyleToColumns(nav) {
  const customColumnStyleElements = nav.querySelectorAll('div[data-style-column]');
  customColumnStyleElements.forEach((customColumnStyleElement) => {
    const customStyleValue = customColumnStyleElement.getAttribute('data-style-column');
    // Split the customStyleValue based on ','
    const pairs = customStyleValue.split(',');

    // For each pair, split it based on ':' to get the column number and style
    pairs.forEach((pair) => {
      const splitPair = pair.trim().split(':');
      const columnNumber = splitPair[0].trim();
      const style = splitPair[1].trim();

      const columnDiv = customColumnStyleElement.querySelector(`.columns[data-block-name='columns'] > div > div:nth-child(${columnNumber})`);
      if (columnDiv === null) return;
      columnDiv.classList.add(style);
    });
  });
}

function applyCustomStyleToListItems(nav) {
  const customListItemStyleElements = nav.querySelectorAll('div[data-style-list-item]');
  customListItemStyleElements.forEach((customListItemStyleElement) => {
    const customStyleValue = customListItemStyleElement.getAttribute('data-style-list-item');
    // Split the customStyleValue based on ','
    const pairs = customStyleValue.split(',');

    // For each pair, split it based on ':' to get the column number and style
    pairs.forEach((pair) => {
      const splitPair = pair.trim().split(':');
      const listItemNumber = splitPair[0].trim();
      const style = splitPair[1].trim();

      const listItem = customListItemStyleElement.querySelector(`ol > li:nth-child(${listItemNumber})`);
      if (listItem === null) return;
      listItem.classList.add(style);
    });
  });
}

function decorateNavWithCustomStyles(nav) {
  applyCustomStyleToColumns(nav);
  applyCustomStyleToListItems(nav);
}

function createTranslateMenu() {
	const translateIcon = createElement('a', {class: 'translate-icon'});
	const languagesDialog = createElement('ul', {id: 'translateDialog', class: 'lang-submenu anchor-cursor', style: 'display: none;'});

  // add the language options to the languages dialog
  TRANSLATE_LANGUAGES.forEach((language, index) => {
		const a = createElement('a', {href: '#'});
		a.textContent = TRANSLATE_LANG_NAMES[index];
		const li = createElement('li', {}, a);
    languagesDialog.append(li);
  });

  translateIcon.addEventListener('click', () => {
    if (languagesDialog.style.display === 'none') {
      languagesDialog.style.display = 'block';
      languagesDialog.style.position = 'fixed'; // dialog overlay
    } else {
      languagesDialog.style.display = 'none';
      languagesDialog.style.position = 'static';
    }
  });

	return createElement('div', {class: 'translate-menu'}, translateIcon, languagesDialog);
}

// Header top bar having brand logo, language selection, login, search and hamburger icon
async function decorateNavBrandBar(nav) {
	const placeHolders = await fetchPlaceholders();
  const logo = createElement('img', {src: LOGO_SRC, alt: placeHolders.navLogoAlt, class: 'logo'});
	const logoLink = createElement('a', {href: '/'}, logo);
  const translateMenu = createTranslateMenu(nav);
	const loginIcon = createElement('a', {class: 'icon-login', href: LOGIN_URL});
	const loginText = createElement('a', {class: 'text-login', href: LOGIN_URL}, placeHolders.navLogin);
	const searchIcon = createElement('a', {class: 'icon-search', href: SEARCH_URL});
	const searchText = createElement('a', {class: 'text-search', href: SEARCH_URL}, placeHolders.navSearch);
	const hamburgerIcon = createElement('div', {class: 'nav-hamburger-icon'});
  hamburgerIcon.addEventListener('click', () => {
    togglePrimaryNavForMobView(nav);
  });
  nav.setAttribute('aria-expanded', 'false');
	const brandRight = createElement('div', {class: 'nav-brand-right'}, translateMenu, loginIcon, loginText, searchIcon, searchText, hamburgerIcon);
	return createElement('div', {class: 'nav-brand'}, logoLink, brandRight);
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  const nav = createElement('nav', {id: 'nav'});
  const navBrand = await decorateNavBrandBar(nav);
  nav.append(navBrand);
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  updatePrimaryNavVisibilityByViewType(nav);
  decorateNavWithCustomStyles(nav);
  addEventsToNavListItems(nav);

  window.addEventListener('resize', () => {
    updatePrimaryNavVisibilityByViewType(nav);
    addEventsToNavListItems(nav);
  });

	const navWrapper = createElement('div', {class: 'nav-wrapper'}, nav);
  block.append(navWrapper);
}
