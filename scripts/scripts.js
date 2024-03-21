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
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
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

    // ---- Apply hero style to first section
    main.firstElementChild.classList.add('product-hero');

    // ---- Move all other sections in a product-body div
    const productBody = document.createElement('div');
    productBody.classList.add('product-body');
    const productContent = document.createElement('div');
    productContent.classList.add('product-content');
    while (main.childElementCount > 1) {
      productContent.appendChild(main.children[1]);
    }
    // Append after the first section
    productBody.appendChild(productContent);
    main.appendChild(productBody);

    // ---- Left rail
    const leftRail = document.createElement('div');
    leftRail.classList.add('left-rail');
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.id = 'left-rail-toggle';
    leftRail.appendChild(toggle);
    const fragmentBlock = buildBlock('fragment', "<a href='/fragments/product-left-rail'/>");
    leftRail.appendChild(fragmentBlock);
    // Prepend to productBody
    productBody.prepend(leftRail);
    decorateBlock(fragmentBlock);
    await loadBlock(fragmentBlock);
    const documentLinks = document.createElement('ul');

    // Add an overview link target to the top of the page
    main.querySelector('.section').id = 'overview';
    const overview = document.createElement('li');
    const overviewLink = document.createElement('a');
    overviewLink.href = '#overview';
    overviewLink.textContent = placeholders.overview;
    overview.appendChild(overviewLink);
    documentLinks.appendChild(overview);

    // For each section, find the first h2 or h2 element
    main.querySelectorAll('h2').forEach((header) => {
      // Add a link to the left rail
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${header.id}`;
      link.textContent = header.textContent;
      li.appendChild(link);
      documentLinks.appendChild(li);
    });
    // Add to the start of the left rail
    leftRail.querySelector('.default-content-wrapper').prepend(documentLinks);
    // ---- Add breadcrumb
    const breadcrumb = document.createElement('div');
    breadcrumb.classList.add('breadcrumb');
    const breadcrumbBlock = buildBlock('breadcrumb', '');
    breadcrumb.appendChild(breadcrumbBlock);
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

  await applyTemplateDefaultContent(main);

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
