// List of URL paths that map to the "Product" template
const productPaths = [
  '/en-us/categories/urethane-additives',
  '/en-us/categories/polyurethane-additives',
  '/en-us/industries/furniture-bedding-and-carpets',
  '/en-us/industries/consumer-goods',
  '/en-us/categories/urethane-additives/niax-catalyst-lc-5636',
  '/en-us/categories/urethane-additives/niax-catalyst-c-41',
  '/en-us/categories/polyurethane-additives/geocelltm-additive-gm-225',
  '/en-us/categories/polyurethane-additives/geocelltm-additive-gm-280',
  '/en-us/categories/polyurethane-additives/geocelltm-gm-hrs',
  '/en-us/categories/polyurethane-additives/geocelltm-silicone-l-450',
  '/en-us/categories/polyurethane-additives/geocelltm-silicone-l-800',
  '/en-us/categories/polyurethane-additives/process-and-foam-modifiers/geolitetm-modifier-206',
  '/en-us/industries/furniture-bedding-and-carpets/geolite-modifier-91',
  '/en-us/categories/urethane-additives/niax-catalyst-ef-708',
  '/en-us/categories/urethane-additives/niax-catalyst-a-107',
  '/en-us/categories/urethane-additives/niax-additive-ra-1',
  '/en-us/categories/urethane-additives/niax-additive-ap-01',
  '/en-us/categories/urethane-additives/niax-catalyst-a-1',
  '/en-us/categories/urethane-additives/niax-catalyst-a-33',
  '/en-us/categories/urethane-additives/niax-catalyst-a-400',
  '/en-us/categories/urethane-additives/niax-catalyst-a-537',
  '/en-us/industries/consumer-goods/niaxtm-catalyst-a-440',
  '/en-us/categories/polyurethane-additives/niax-catalyst-ef-150',
  '/en-us/categories/polyurethane-additives/catalysts/niaxtm-catalyst-ef-100s',
  '/en-us/categories/urethane-additives/niax-silicone-l-3639',
  '/en-us/categories/polyurethane-additives/flexible-slabstock-foams/niax-catalyst-ef-350',
  '/en-us/categories/urethane-additives/niax-catalyst-k-zero-g',
  '/en-us/categories/polyurethane-additives/flexible-slabstock-foams/niax-silicone-l-838',
  '/en-us/categories/polyurethane-additives/flexible-slabstock-foams/niaxtm-silicone-l-422',
  '/en-us/categories/polyurethane-additives/flexible-slabstock-foams/niaxtm-silicone-l-818',
  '/en-us/categories/polyurethane-additives/flexible-slabstock-foams/niaxtm-silicone-l-820',
  '/en-us/categories/polyurethane-additives/flexible-slabstock-foams/niaxtm-silicone-l-895',
  '/en-us/industries/consumer-goods/niaxtm-silicone-l-417',
  '/en-us/categories/polyurethane-additives/niax-silicone-l-894',
  '/en-us/categories/polyurethane-additives/niax-flame-lamination-additive-fle-200lf',
  '/en-us/categories/polyurethane-additives/niaxtm-catalyst-ef-700',
  '/en-us/categories/urethane-additives/niax-silicone-l-627',
  '/en-us/categories/urethane-additives/niax-color-stabilizer-cs-22lf',
  '/en-us/categories/urethane-additives/niax-silicone-l-6638',
  '/en-us/categories/urethane-additives/niax-silicone-l-6642',
  '/en-us/categories/urethane-additives/niax-silicone-l-1507',
  '/en-us/categories/urethane-additives/niax-silicone-l-5302',
  '/en-us/categories/urethane-additives/niax-silicone-l-5617',
  '/en-us/categories/polyurethane-additives/flexible-slabstock-foams/niaxtm-silicone-y-16420',
  '/en-us/categories/polyurethane-additives/niaxtm-catalyst-ef-600s',
  '/en-us/categories/urethane-additives/niax-silicone-l-5309',
  '/en-us/categories/urethane-additives/niax-silicone-l-3415',
  '/en-us/categories/urethane-additives/niax-silicone-l-6186',
  '/en-us/categories/urethane-additives/niax-silicone-l-6884',
  '/en-us/categories/urethane-additives/niax-catalyst-stannous-octoate',
  '/en-us/categories/urethane-additives/niax-silicone-l-3416',
  '/en-us/categories/urethane-additives/niax-catalyst-a-577',
  '/en-us/categories/urethane-additives/niax-silicone-l-1500',
  '/en-us/categories/urethane-additives/niax-silicone-l-2171',
  '/en-us/categories/polyurethane-additives/niax-catalyst-ef-600',
  '/en-us/categories/urethane-additives/niax-silicone-l-6633',
  '/en-us/categories/urethane-additives/niax-silicone-l-5690',
  '/en-us/categories/urethane-additives/niax-silicone-l-6635',
  '/en-us/categories/urethane-additives/niax-silicone-l-5348',
  '/en-us/categories/urethane-additives/niax-silicone-l-5111',
  '/en-us/categories/urethane-additives/niax-silicone-l-1160',
  '/en-us/categories/urethane-additives/niax-silicone-l-5360',
  '/en-us/categories/urethane-additives/niax-silicone-l-6891',
  '/en-us/categories/urethane-additives/niax-silicone-l-6164',
  '/en-us/categories/polyurethane-additives/niax-silicone-l-6189',
  '/en-us/order/find-a-tds',
];

const createTechnicalDocumentsBlock = (main, document) => {
  const techHighlightWrapper = document.querySelector(
    '.grid.techhilighte-wrapp',
  );
  if (techHighlightWrapper) {
    const cells = [['Documents (Technical)']];

    // Initialize a string to hold all links
    let linksContent = '';
    const links = techHighlightWrapper.querySelectorAll('a');
    links.forEach((link, index) => {
      // For each link, append it to the linksContent string
      // Add a line break after each link, except the last one
      linksContent += `<a href="${
        link.href
      }" target="_blank">${link.textContent.trim()}</a>${
        index < links.length - 1 ? '<br>' : ''
      }`;
    });

    // Add the links string as a new row in the cells array
    cells.push([linksContent]);

    const table = WebImporter.DOMUtils.createTable(cells, document);

    // Append the table to the main element and remove the original wrapper
    main.append(table);
    techHighlightWrapper.remove();
  }
};

/** Create Related Products block */
const createRelatedProductsBlock = (main, document) => {
  const relatedProductsDiv = document.querySelector('#divRelatedProducts');
  if (
    relatedProductsDiv &&
    relatedProductsDiv.querySelectorAll('a').length > 0
  ) {
    const cells = [['Related Products']];

    relatedProductsDiv
      .querySelectorAll('.related-products div[id]')
      .forEach((div) => {
        let content = '';
        const title = div.querySelector('.titleDemi')
          ? div.querySelector('.titleDemi').outerHTML
          : '';
        content += title;

        const description = div.querySelector('p:not(.titleDemi)')
          ? div.querySelector('p:not(.titleDemi)').outerHTML
          : '';
        content += description;

        const links = div.querySelectorAll('.links-related-products a');
        links.forEach((link) => {
          content += link.outerHTML;
        });
        cells.push([content]); // Add the concatenated content as a new row with HTML
      });

    const table = WebImporter.DOMUtils.createTable(cells, document);
    main.append(table);
  }
  relatedProductsDiv?.remove();
};

/** Create Product Documents block */
const createProductDocumentsBlock = (main, document) => {
  const literatureSection = document.querySelector(
    '.table-grid-lg.grid-bordered.bg-gray-lightest-sm',
  );
  if (literatureSection) {
    // Start with the block title
    const cells = [['Documents (Product)']];

    // Initialize an empty string to hold all link HTML
    let allLinksHtml = '';

    const links = literatureSection.querySelectorAll('.mydoc a');
    links.forEach((link, index) => {
      // Append the link HTML and add a line break after each link, except the last one
      allLinksHtml += `${link.outerHTML}${
        index < links.length - 1 ? '<br>' : ''
      }`;
    });

    // If there are links, add them as a single row
    if (allLinksHtml) {
      cells.push([allLinksHtml]);
    }

    const table = WebImporter.DOMUtils.createTable(cells, document);
    main.append(table);
    literatureSection.remove(); // Remove the original literature section from the DOM
  }
};

const createMetadata = (main, document, url) => {
  const meta = {};

  // General metadata extraction
  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.textContent.trim();
  }

  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content.trim();
  }

  const img = document.querySelector('[property="og:image"]');
  if (img && img.content) {
    meta.Image = img.content.trim();
  }

  // Extracting the path from the URL string
  const parsedUrl = new URL(url);
  const path = parsedUrl.pathname;

  // Check if the current path matches any of the predefined product paths
  const isProductPath = productPaths.some((productPath) =>
    path.startsWith(productPath),
  );
  meta.Template = isProductPath ? 'Product' : '';

  // Initialize brand and industry as empty strings
  let brand = '';
  let industry = '';

  // Extracting brand and industry from their respective sections
  const metadataColumns = document.querySelectorAll(
    '.table-grid-md.grid-bordered.text-white-sm.text-center-lg.equal-row .table-grid-col',
  );
  metadataColumns.forEach((column, index) => {
    const h6Element = column.querySelector('h6');
    if (h6Element && h6Element.textContent.includes('Explore:')) {
      const text = h6Element.textContent.replace('Explore:', '').trim();
      if (index === 0) {
        brand = text; // Assuming the first column should contain the brand
      } else {
        industry = text; // Any subsequent column could contain the industry
      }
    }
  });

  // Assign brand and industry to meta if they are found
  if (brand) meta.Brand = brand;
  if (industry) meta.Industry = industry;

  // Remove the brand and industry section from the DOM
  const brandAndIndustrySection = document.querySelector(
    '.table-grid-md.grid-bordered.text-white-sm.text-center-lg.equal-row',
  );
  brandAndIndustrySection?.remove();

  // Create and append the metadata block if any metadata was found
  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

export default {
  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document,
    url,
    html,
    params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const main = document.body;

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      'header',
      'footer',
      'aside',
      '.cookie-banner',
      '#feedback',
      '#hdn-banner-msg-flag',
      '#gatedContentRequestForm',
      '.slide-in-container',
      '#disclaimer',
      '#loadingpanel',
      '.scroll-anchor',
    ]);

    const productDetailSection = document.querySelector('.product-detail-top');
    productDetailSection?.after(document.createElement('hr'));

    const moreAboutSection = document.querySelector(
      '.more-information-container',
    );

    moreAboutSection?.after(document.createElement('hr'));

    // Use helper methods to create and append various blocks to the main element
    // createProductHeroBlock(main, document);
    // Add other blocks creation calls here, e.g., createTabs(main, document);
    createTechnicalDocumentsBlock(main, document);
    createRelatedProductsBlock(main, document);
    createProductDocumentsBlock(main, document);
    createMetadata(main, document, url);

    return main;
  },

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @return {string} The path
   */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document,
    url,
    html,
    params,
  }) =>
    WebImporter.FileUtils.sanitizePath(
      new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, ''),
    ),
};
