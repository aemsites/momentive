import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  navSections.setAttribute('aria-expanded', expanded ? 'false' : 'true');
}

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
  const languages = ['zh-cn', 'de-de', 'ja-jp', 'pt-br', 'es-mx', 'ko-kr'];
  const languageNames = ['中文', 'Deutsch', '日本語', 'Português', 'Español', '한국어'];
  languages.forEach((language, index) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.dataset.url = 'null';
    // a.onclick = () => fnChangeLanguage(language);
    a.textContent = languageNames[index];
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

function handleSecondaryNavForMobView(item, listItems) {
  const expanded = item.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
  item.setAttribute('aria-expanded', expanded);

  // Get the child list of the clicked list item
  const childList = item.querySelector('ul');

  if (expanded === 'true') {
    listItems.forEach((siblingItem) => {
      if (siblingItem !== item) {
        siblingItem.style.display = 'none';
      }
    });
    if (childList) {
      childList.classList.add('sub-nav-list');
      childList.style.display = 'block';
      if (item.textContent.includes('ORDER PRODUCTS')) {
        const secondLevelList = childList.querySelector('ul');
        secondLevelList.classList.add('order-products-sub-list');
      }
    }
  } else {
    // If 'aria-expanded' is 'false', display all list items
    listItems.forEach((siblingItem) => {
      siblingItem.style.display = 'block';
    });

    if (childList) {
      childList.classList.add('sub-nav-list');
      childList.style.display = 'none';
    }
  }
}

function handleSecondaryNavForDesktop(nav, item) {
  const subList = item.querySelector('ul');
  const expanded = subList.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
  if (expanded === 'false') {
    subList.setAttribute('aria-expanded', 'false');
  } else {
    subList.setAttribute('aria-expanded', 'true');
    subList.className = 'sub-nav-list';
    if (item.textContent.startsWith('PRODUCTS')) {
      subList.classList.add('product-sub-list');
      const secondLevelLists = subList.querySelectorAll('ul');
      if (secondLevelLists.length > 0) {
        secondLevelLists.forEach((secondLevelList) => {
          secondLevelList.classList.add('product-sub-sub-list');
        });
      }
      // const secondLevelListItem = subList.querySelector('li');
      const listItems = Array.from(subList.querySelectorAll('li'));
      const productCategoriesListItem = listItems.find((li) => li.textContent.startsWith('PRODUCT CATEGORIES'));
      productCategoriesListItem.classList.add('product-categories-list-item');
      const industriesListItem = listItems.find((li) => li.textContent.startsWith('INDUSTRIES'));
      industriesListItem.classList.add('industries-list-item');
      const brandListItem = listItems.find((li) => li.textContent.startsWith('BRAND'));
      brandListItem.classList.add('brand-list-item');
    } else if (item.textContent.startsWith('ORDER PRODUCTS')) {
      subList.classList.add('order-products-sub-list');
      const orderProductsSubList = subList.querySelector('li > ul');
      orderProductsSubList.classList.add('order-products-list-item');
    }
  }
}

function addEventsToNavItems(nav) {
  const listItems = nav.querySelectorAll('.nav-sections .default-content-wrapper > ul > li');

  listItems.forEach((item) => {
    if (isDesktop.matches) {
      const mouseHoverListenersAdded = item.getAttribute('data-mouse-hover-listener-added') || 'false';
      if (mouseHoverListenersAdded === 'false') {
        item.addEventListener('mouseenter', () => {
          handleSecondaryNavForDesktop(nav, item);
        });
        item.addEventListener('mouseleave', () => {
          handleSecondaryNavForDesktop(nav, item);
        });
        item.setAttribute('data-mouse-hover-listener-added', 'true');
      }
    } else if (!isDesktop.matches) {
      const clickListenerAdded = item.getAttribute('data-clk-listener-added');
      if (clickListenerAdded === 'false') {
        item.addEventListener('click', () => {
          handleSecondaryNavForMobView(item, listItems);
        });
        item.setAttribute('data-clk-listener-added', 'true');
      }
    }
  });
}

function createPrimaryNavForMobView(nav) {
  if (isDesktop.matches) return;

  const mobileNavExists = nav.getAttribute('mobile-nav');
  if (mobileNavExists) return;
  const productsSubList = nav.querySelector('.nav-sections .default-content-wrapper > ul > li > ul');
  const listItems = productsSubList.querySelectorAll('li');

  // Add classes based on the text content of the list items
  listItems.forEach((item) => {
    // Create a new i element and set its class to "arrow right"
    const arrowElement = document.createElement('i');
    arrowElement.className = 'arrow-right';
    if (item.textContent.includes('PRODUCT CATEGORIES')) {
      item.classList.add('secondary-nav-header', 'secondary-nav-product-categories');
      item.appendChild(arrowElement);
    } else if (item.textContent.includes('INDUSTRIES')) {
      item.classList.add('secondary-nav-header', 'secondary-nav-industries');
      item.appendChild(arrowElement);
    } else if (item.textContent.includes('BRAND')) {
      item.classList.add('secondary-nav-header', 'secondary-nav-brand');
      item.appendChild(arrowElement);
    }
  });

  const productsSubListHTML = Array.from(productsSubList.children).map((child) => child.outerHTML).join('');
  const productsListItem = nav.querySelector('.nav-sections .default-content-wrapper > ul > li');
  productsListItem.setAttribute('aria-expanded', 'true');
  productsSubList.remove();
  productsListItem.insertAdjacentHTML('afterend', productsSubListHTML);
  nav.setAttribute('mobile-nav', true);
  addEventsToNavItems(nav);
}

// Restore nav list items on window resize from mobile to desktop
function restoreNavOnWindowResize() {
  const nav = document.getElementById('nav');
  // const expanded = nav.getAttribute('aria-expanded') === 'true';
  nav.setAttribute('aria-expanded', 'false');
  if (nav.getAttribute('mobile-nav') === null) return;
  const navList = nav.querySelector('.nav-sections .default-content-wrapper > ul');
  if (navList === null) return;
  const listItems = navList.querySelectorAll('li');

  const productsSubList = document.createElement('ul');
  // Remove classes based on the text content of the list items
  listItems.forEach((item) => {
    if (item.textContent.includes('PRODUCT CATEGORIES')) {
      item.classList.remove('secondary-nav-header', 'secondary-nav-product-categories');
      item.removeChild(item.querySelector('.arrow-right'));
      productsSubList.append(item);
    } else if (item.textContent.includes('INDUSTRIES')) {
      item.classList.remove('secondary-nav-header', 'secondary-nav-industries');
      item.removeChild(item.querySelector('.arrow-right'));
      productsSubList.append(item);
    } else if (item.textContent.includes('BRAND')) {
      item.classList.remove('secondary-nav-header', 'secondary-nav-brand');
      item.removeChild(item.querySelector('.arrow-right'));
      productsSubList.append(item);
    }
  });

  if (productsSubList.children.length === 0) return;

  const productListItem = nav.querySelector('.nav-sections .default-content-wrapper > ul > li');
  productListItem.appendChild(productsSubList);
  nav.removeAttribute('mobile-nav');
}

// Header top bar having brand logo, language selection, login, search and hamburger icon
function decorateNavBrandBar(nav) {
  const navBrand = document.createElement('div');
  const logoLink = document.createElement('a');
  logoLink.href = '/';

  const logo = document.createElement('img');
  logo.src = '/images/mpm_logo_white_color_v_tag_long_sml.png';
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
  loginIcon.href = 'https://www.momentive.com/en-us/login';

  const loginText = document.createElement('a');
  loginText.classList.add('text-login');
  loginText.textContent = 'LOG IN / REGISTER';
  loginText.href = 'https://www.momentive.com/en-us/login';

  const searchIcon = document.createElement('a');
  searchIcon.classList.add('icon-search');
  searchIcon.href = '#';

  const searchText = document.createElement('a');
  searchText.classList.add('text-search');
  searchText.textContent = 'SEARCH';
  searchText.href = '#';

  // hamburger for mobile view
  const hamburgerIcon = document.createElement('div');
  hamburgerIcon.classList.add('nav-hamburger-icon');
  hamburgerIcon.addEventListener('click', () => {
    const navSections = nav.querySelector('.nav-sections');
    createPrimaryNavForMobView(nav);
    toggleMenu(nav, navSections);
  });
  nav.setAttribute('aria-expanded', 'false');

  brandRight.append(loginIcon, loginText, searchIcon, searchText, hamburgerIcon);
  navBrand.append(brandRight);
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
  const classes = ['brand', 'sections'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  if (isDesktop.matches) {
    addEventsToNavItems(nav);
  }
  window.addEventListener('resize', () => {
    if (window.matchMedia('(max-width: 900px)').matches) {
      createPrimaryNavForMobView(nav);
    } else {
      restoreNavOnWindowResize();
    }
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
