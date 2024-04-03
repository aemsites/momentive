/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/** Create Technical Products block */
const createTechnicalProductsBlock = (document) => {
  const techHighlightWrapper = document.querySelector('.grid.techhilighte-wrapp');
  if (techHighlightWrapper?.querySelectorAll('a').length > 0) {
    const cells = [['Technical Products']]; // Title row

    techHighlightWrapper.querySelectorAll('ul').forEach((ul) => {
      let content = '';
      const title = ul.querySelector('h4')?.outerHTML || '';
      content += title; // Add the title as HTML, but not as a list item

      // Start an unordered list for the links
      let linksContent = '<ul>';
      const links = ul.querySelectorAll('a');
      links.forEach((link) => {
        // Wrap each link in a list item tag to create a bullet point
        linksContent += `<li>${link.outerHTML}</li>`;
      });
      linksContent += '</ul>'; // Close the unordered list

      // Append the links list to the content after the title
      content += linksContent;

      cells.push([content]); // Add the concatenated content as a new row with HTML
    });

    const table = WebImporter.DOMUtils.createTable(cells, document);
    techHighlightWrapper.replaceWith(table); // Replace the original section with the new table
  }
};

/** Create Related Products block */
const createRelatedProductsBlock = (document) => {
  const relatedProductsDiv = document.querySelector('#divRelatedProducts');
  if (relatedProductsDiv?.querySelectorAll('a').length > 0) {
    const cells = [['Related Products']];

    relatedProductsDiv
      .querySelectorAll('.related-products div[id]')
      .forEach((div) => {
        let content = '';
        const title = div.querySelector('.titleDemi')?.outerHTML || '';
        content += title;

        const description = div.querySelector('p:not(.titleDemi)')?.outerHTML || '';
        content += description;

        const links = div.querySelectorAll('.links-related-products a');
        links.forEach((link) => {
          content += link.outerHTML;
        });

        cells.push([content]); // Add the concatenated content as a new row with HTML
      });

    const table = WebImporter.DOMUtils.createTable(cells, document);
    relatedProductsDiv.replaceWith(table); // Replace the original section with the new table
  }
  relatedProductsDiv?.remove();
};

/** Create Product Literature block */
const createProductLiteratureBlock = (document) => {
  const literatureSection = document.querySelector('.table-grid-lg.grid-bordered.bg-gray-lightest-sm');
  if (literatureSection) {
    // Start with the block title
    const cells = [['Product Literature']];

    // Initialize an empty string to hold all link HTML
    let allLinksHtml = '';

    // Iterate over each literature link, adding its HTML to the string
    literatureSection.querySelectorAll('.mydoc a').forEach((link) => {
      allLinksHtml += link.outerHTML;
    });

    // If there are links, add them as a single row
    if (allLinksHtml) {
      cells.push([allLinksHtml]);
    }

    const table = WebImporter.DOMUtils.createTable(cells, document);
    literatureSection.replaceWith(table); // Replace the original section with the new table
  }
};

const createMetadata = (main, document) => {
  const meta = {};

  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.textContent.replace(/[\n\t]/gm, '');
  }

  const desc = document.querySelector("[property='og:description']");
  if (desc) {
    meta.Description = desc.content;
  }

  const img = document.querySelector("[property='og:image']");
  if (img && img.content) {
    const el = document.createElement('img');
    el.src = img.content;
    meta.Image = el;
  }

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

/** Create Page Metadata block */
const createPageMetadataBlock = (main, document) => {
  const cells = [['Page Metadata']]; // Title row

  // Get the page title
  const pageTitleElement = document.querySelector('.page-header');
  const pageTitle = pageTitleElement ? pageTitleElement.textContent : '';
  cells.push(['Title', pageTitle]);

  // Initialize brand and industry as empty strings
  let brand = '';
  let industry = '';

  // Get all columns within the metadata section
  const metadataColumns = document.querySelectorAll('.table-grid-md.grid-bordered.text-white-sm.text-center-lg.equal-row .table-grid-col');

  // Iterate through each column to find brand and industry
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

  // Add brand and industry to the cells if available
  if (brand) cells.push(['Brand', brand]);
  if (industry) cells.push(['Industry', industry]);

  // Remove the brand and industry section from the DOM
  const brandAndIndustrySection = document.querySelector('.table-grid-md.grid-bordered.text-white-sm.text-center-lg.equal-row');
  brandAndIndustrySection?.remove();

  // Create the table and append it to the main element only if metadata is available
  if (pageTitle || brand || industry) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    main.appendChild(table);
  }
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

    // Use helper methods to create and append various blocks to the main element
    // createProductHeroBlock(main, document);
    // Add other blocks creation calls here, e.g., createTabs(main, document);
    createTechnicalProductsBlock(document);
    createRelatedProductsBlock(document);
    createProductLiteratureBlock(document);
    createMetadata(main, document);
    createPageMetadataBlock(main, document);

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
  }) => WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')),
};

/** Create Product Hero block */
// const createProductHeroBlock = (main, document) => {
//     // Extract the product title
//     const productTitle = document.querySelector('.page-header').textContent;

//     // More specific selector for the subtitle, targeting the <p> tag directly
//     const productSubtitle = document.querySelector('.product-detail-top .text-caps').textContent.trim();

//     // Extract the description, ensuring it's separate from the subtitle
//     const productDescriptionParagraphs = document.querySelectorAll('.product-detail-top p:not(.text-caps)');
//     const productDescription = Array.from(productDescriptionParagraphs)
//                                     .map(p => p.textContent.trim())
//                                     .filter(text => text.length > 0)
//                                     .join('\n\n');

//     // SDS and Technical Data Sheet links
//     const sdsLink = document.querySelector('.sdsDocument').href;
//     const tdsLink = document.querySelector('.gatedContentLink').href;

//     // Check for a brochure
//     const brochureDiv = document.querySelector('#div_brochure');
//     const brochureExists = brochureDiv && brochureDiv.getAttribute('visible') !== false;
//     const brochureTitle = brochureExists ? brochureDiv.querySelector('h5').textContent : '';
//     const brochureImage = brochureExists ? brochureDiv.querySelector('img').src : '';
//     const brochureDownloadLink = brochureExists ? brochureDiv.querySelector('a').href : '';

//     // Construct the table cells for the Product Hero block, including brochure if exists
//     const cells = [
//         [brochureExists ? 'Product Hero (Brochure)' : 'Product Hero'],
//         ['Title', productTitle],
//         ['Subtitle', productSubtitle],
//         ['Description', productDescription],
//         ['Safety Data Sheets', sdsLink],
//         ['Technical Data Sheets', tdsLink],
//     ];

//     // Add brochure information if exists
//     if (brochureExists) {
//         cells.push(['Brochure Title', brochureTitle]);
//         cells.push(['Brochure Image', brochureImage]);
//         cells.push(['Brochure Download', brochureDownloadLink]);
//     }

//     // Create the table and append it to the main element
//     const table = WebImporter.DOMUtils.createTable(cells, document);
//     main.appendChild(table);
// };

/** Create Related Products block */
// const createRelatedProductsBlock = (main, document) => {
//     const relatedProducts = [
//         {
//             id: 'colFormulation',
//             prefix: 'formulationProduct',
//             title: 'GRADES/FORMULATION',
//             description: 'Similar products that vary by small adjustments to performance properties; but, provide the same function or benefit.'
//         },
//         {
//             id: 'colComplementary',
//             prefix: 'complimentaryProduct',
//             title: 'Complementary Products',
//             description: 'Similar products that may enhance results or work well together.'
//         },
//         {
//             id: 'colApplication',
//             prefix: 'similarApplicationProduct',
//             title: 'Similar Application',
//             description: 'Similar products that have similar capabilities or can be applied to similar needs.'
//         }
//     ];

//     // Initialize cells array with the block title
//     const cells = [['Related Products']];

//     relatedProducts.forEach(product => {
//         const productElement = document.getElementById(product.id);
//         if (productElement) {
//             // Add product title and description with prefixes
//             cells.push([`${product.prefix}Title`, product.title]);
//             cells.push([`${product.prefix}Description`, product.description]);

//             // Extract product links, titles and URLs
//             const links = Array.from(productElement.querySelectorAll('.links-related-products a'));
//             const linkTitles = links.map(link => link.textContent).join(', ');
//             const linkUrls = links.map(link => link.href).join(', ');

//             // Add link titles and URLs with prefixes as separate rows
//             if (links.length > 0) {
//                 cells.push([`${product.prefix}LinkTitles`, linkTitles]);
//                 cells.push([`${product.prefix}LinkURLs`, linkUrls]);
//             }
//         }
//     });

//     // Create the table and append it to the main element if there are related products
//     if (cells.length > 1) { // Considering the block title already added
//         const table = WebImporter.DOMUtils.createTable(cells, document);
//         main.appendChild(table);
//     }
// };

/** Create Product Literature block */
// const createProductLiteratureBlock = (main, document) => {
//     // Check if the Product Literature section exists
//     const literatureSection = document.querySelector('.table-grid-lg.grid-bordered.bg-gray-lightest-sm');
//     if (literatureSection) {
//         const links = literatureSection.querySelectorAll('.mydoc .gatedContentLink');

//         // Extract link names and URLs
//         const linkNames = Array.from(links).map(link => link.textContent.trim()).join(', ');
//         const linkURLs = Array.from(links).map(link => link.href).join(', ');

//         // Construct the cells for the Product Literature block
//         const cells = [
//             ['Product Literature'],
//             ['Link Names', linkNames],
//             ['Link URLs', linkURLs]
//         ];

//         // Create the table and append it to the main element
//         const table = WebImporter.DOMUtils.createTable(cells, document);
//         main.appendChild(table);
//     }
// };
