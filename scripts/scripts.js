import {
  sampleRUM,
  buildBlock,
  loadBlock,
  loadHeader,
  loadFooter,
  fetchPlaceholders,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlock,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  createElement,
} from './aem.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    main.prepend(createElement('div', {}, buildBlock('hero', { elems: [picture, h1] })));
  } else if (h1) {
    // Check if there are any siblings after h1, if so move them into a new section
    const next = h1.nextElementSibling;
    if (next) {
      const firstSection = h1.parentElement;
      const heroSection = createElement('section', { class: 'section' }, h1);
      firstSection.parentElement.prepend(heroSection);
    }
    h1.parentElement.classList.add('plain-hero');
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

function createBreadcrumbItem(href, label, isLast = false) {
  const li = document.createElement('li');
  if (!isLast) {
    const a = document.createElement('a');
    a.classList.add('breadcrumb-item');
    a.href = href;
    a.textContent = ` / ${label}`;
    li.appendChild(a);
  } else {
    // If it's the last item, just add the text without a link
    li.textContent = ` / ${label}`;
  }
  return li;
}

/**
 * Builds breadcrumb menu and returns it.
 * @returns {HTMLElement} Newly created breadcrumb.
 */
export function buildBreadcrumb() {
  const path = window.location.pathname;

  if (path === '/' || document.title === '404') {
    return undefined;
  }

  const pathSegments = path.split('/').filter(Boolean);
  const list = document.createElement('ul');
  list.classList.add('breadcrumb-list');
  let baseUrl = '';

  // Iterate through each segment except the last one
  pathSegments.slice(1, -1).forEach((segment) => {
    baseUrl += `/${segment}`;
    const label = segment === pathSegments[1] ? segment.replace('-', ' ') : segment;
    list.appendChild(createBreadcrumbItem(baseUrl, label));
  });

  // Handle the last segment separately without creating a link
  if (pathSegments.length > 1) { // Check to ensure there's at least one segment after domain part
    const lastSegment = pathSegments[pathSegments.length - 1];
    list.appendChild(createBreadcrumbItem('', lastSegment, true)); // Pass true for isLast parameter
  }

  const breadcrumb = document.createElement('div');
  breadcrumb.classList.add('breadcrumb');
  breadcrumb.appendChild(list);

  return breadcrumb;
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

async function applyTemplateDefaultContent(main) {
  // Get classes for body element
  const bodyClasses = document.body.classList;

  // Check for known templates
  if (bodyClasses.contains('product')) {
    const placeholders = await fetchPlaceholders();

    // ---- Left rail
    const leftRailBlock = buildBlock('left-rail', [
      ['first section name', placeholders.overview],
      ['toc', true],
      ['embed', '/fragments/product-left-rail'],
    ]);
    const leftRail = createElement('div', {}, leftRailBlock);
    // Prepend after the first section (the hero)
    main.firstElementChild.after(leftRail);
    decorateBlock(leftRailBlock);
    loadBlock(leftRailBlock);

    // ---- Add breadcrumb
    const breadcrumbBlock = buildBlock('breadcrumb', '');
    const breadcrumb = createElement('div', {}, breadcrumbBlock);
    // Append before the first section
    main.firstElementChild.before(breadcrumb);
    decorateBlock(breadcrumbBlock);
    loadBlock(breadcrumbBlock);
  }
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    applyTemplateDefaultContent(main);
    buildBreadcrumb();
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
