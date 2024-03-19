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

const createMetadata = (main, document) => {
  const meta = {};

  // General metadata extraction
  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.textContent.replace(/[\n\t]/gm, '');
  }

  // Set Template to "Product" if .product-detail-top exists, otherwise leave it blank
  const productDetailExists = document.querySelector('.product-detail-top');
  meta.Template = productDetailExists ? 'Product' : '';

  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  const img = document.querySelector('[property="og:image"]');
  if (img && img.content) {
    const el = document.createElement('img');
    el.src = img.content;
    meta.Image = el;
  }

  // Initialize brand and industry as empty strings and then try to extract them
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
        // Assuming the first column should contain the brand
        brand = text;
      } else {
        // Assuming any subsequent column could contain the industry
        industry = text;
      }
    }
  });

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
