import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const LOGO_SRC = '/images/mpm_logo_white_color_v_tag_long_sml.png';
const LOGO_ALT = 'Momentive Performance Materials Logo';
const LOGIN_URL = 'https://www.momentive.com/en-us/login';
const LOGIN_TEXT = 'LOG IN / REGISTER';
const SEARCH_URL = '#';
const SEARCH_TEXT = 'SEARCH';
const TRANSLATE_LANGUAGES = ['zh-cn', 'de-de', 'ja-jp', 'pt-br', 'es-mx', 'ko-kr'];
const TRANSLATE_LANG_NAMES = ['中文', 'Deutsch', '日本語', 'Português', 'Español', '한국어'];

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function createTranslateMenu() {
  const translateMenu = document.createElement('div');
  translateMenu.classList.add('translate-menu');

  const translateIcon = document.createElement('a');
  translateIcon.classList.add('translate-icon');

  // create ul element for the languages dialog
  const languagesDialog = document.createElement('ul');
  languagesDialog.id = 'LanguageId';
  languagesDialog.classList.add('lang-submenu', 'anchor-cursor');
  languagesDialog.style.display = 'none';

  // add the language options to the languages dialog
  TRANSLATE_LANGUAGES.forEach((language, index) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.dataset.url = 'null';
    // a.onclick = () => fnChangeLanguage(language);
    a.textContent = TRANSLATE_LANG_NAMES[index];
    li.append(a);
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

  translateMenu.append(translateIcon, languagesDialog);
  return translateMenu;
}

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

  // Get the child list of the clicked list item
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

// Header top bar having brand logo, language selection, login, search and hamburger icon
function decorateNavBrandBar(nav) {
  const navBrand = document.createElement('div');
  const logoLink = document.createElement('a');
  logoLink.href = '/';

  const logo = document.createElement('img');
  logo.src = LOGO_SRC;
  logo.alt = LOGO_ALT;
  logo.classList.add('logo');
  logoLink.append(logo);
  navBrand.append(logoLink);

  // create a div for the right side of the brand div
  const brandRight = document.createElement('div');
  brandRight.classList.add('nav-brand-right');

  const translateMenu = createTranslateMenu(nav, brandRight);
  brandRight.append(translateMenu);

  const loginIcon = document.createElement('a');
  loginIcon.classList.add('icon-login');
  loginIcon.href = LOGIN_URL;

  const loginText = document.createElement('a');
  loginText.classList.add('text-login');
  loginText.textContent = LOGIN_TEXT;
  loginText.href = LOGIN_URL;

  const searchIcon = document.createElement('a');
  searchIcon.classList.add('icon-search');
  searchIcon.href = SEARCH_URL;

  const searchText = document.createElement('a');
  searchText.classList.add('text-search');
  searchText.textContent = SEARCH_TEXT;
  searchText.href = SEARCH_URL;

  // hamburger for mobile view
  const hamburgerIcon = document.createElement('div');
  hamburgerIcon.addEventListener('click', () => {
    togglePrimaryNavForMobView(nav);
  });
  hamburgerIcon.classList.add('nav-hamburger-icon');
  nav.setAttribute('aria-expanded', 'false');

  brandRight.append(loginIcon, loginText, searchIcon, searchText, hamburgerIcon);
  navBrand.append(brandRight);
  navBrand.classList.add('nav-brand');
  return navBrand;
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

  // decorate nav DOM
  const nav = document.createElement('nav');
  nav.id = 'nav';

  const navBrand = decorateNavBrandBar(nav);
  nav.append(navBrand);

  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  updatePrimaryNavVisibilityByViewType(nav);
  decorateNavWithCustomStyles(nav);
  addEventsToNavListItems(nav);

  window.addEventListener('resize', () => {
    updatePrimaryNavVisibilityByViewType(nav);
    addEventsToNavListItems(nav);
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
