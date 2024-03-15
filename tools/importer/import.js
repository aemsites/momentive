const createTechnicalDocumentsBlock = (document) => {
    const techHighlightWrapper = document.querySelector('.grid.techhilighte-wrapp');
    if (techHighlightWrapper) {
        const cells = [['Technical Documents']];

        // Start an unordered list for all links
        let linksContent = '<ul>';
        const links = techHighlightWrapper.querySelectorAll('a');
        links.forEach(link => {
            // For each link, create a list item regardless of its type (SDS or Technical Data Sheet)
            linksContent += `<li><a href="${link.href}" target="_blank">${link.textContent.trim()}</a></li>`;
        });
        linksContent += '</ul>'; // Close the unordered list

        // Add the links list as a new row in the cells array
        cells.push([linksContent]);

        const table = WebImporter.DOMUtils.createTable(cells, document);

        // Replace the original tech highlights wrapper with the new table
        techHighlightWrapper.replaceWith(table);
    }
};

/** Create Related Products block */
const createRelatedProductsBlock = (document) => {
    const relatedProductsDiv = document.querySelector('#divRelatedProducts');
    if (relatedProductsDiv && relatedProductsDiv.querySelectorAll('a').length > 0) {
        const cells = [['Related Products']]; 

        relatedProductsDiv.querySelectorAll('.related-products div[id]').forEach(div => {
            let content = '';
            const title = div.querySelector('.titleDemi') ? div.querySelector('.titleDemi').outerHTML : '';
            content += title; 

            const description = div.querySelector('p:not(.titleDemi)') ? div.querySelector('p:not(.titleDemi)').outerHTML : '';
            content += description;

            const links = div.querySelectorAll('.links-related-products a');
            links.forEach(link => {
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
        literatureSection.querySelectorAll('.mydoc a').forEach(link => {
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

    // General metadata extraction
    const title = document.querySelector('title');
    if (title) {
      meta.Title = title.textContent.replace(/[\n\t]/gm, '');
    }

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

    const categoryElement = document.querySelector('[property="productCategory_string"]');
    if (categoryElement && categoryElement.content) {
      const firstCategory = categoryElement.content.split(',')[0].trim();
      meta.Template = firstCategory;
    }

    // Initialize brand and industry as empty strings and then try to extract them
    let brand = '';
    let industry = '';

    // Extracting brand and industry from their respective sections
    const metadataColumns = document.querySelectorAll('.table-grid-md.grid-bordered.text-white-sm.text-center-lg.equal-row .table-grid-col');
    metadataColumns.forEach((column, index) => {
        const h6Element = column.querySelector('h6');
        if (h6Element && h6Element.textContent.includes('Explore:')) {
            const text = h6Element.textContent.replace('Explore:', '').trim();
            if (index === 0) { // Assuming the first column should contain the brand
                brand = text;
            } else { // Assuming any subsequent column could contain the industry
                industry = text;
            }
        }
    });

    if (brand) meta.Brand = brand;
    if (industry) meta.Industry = industry;

    // Remove the brand and industry section from the DOM
    const brandAndIndustrySection = document.querySelector('.table-grid-md.grid-bordered.text-white-sm.text-center-lg.equal-row');
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
      document, url, html, params,
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

      // Use helper methods to create and append various blocks to the main element
      // createProductHeroBlock(main, document);
      // Add other blocks creation calls here, e.g., createTabs(main, document);
      createTechnicalDocumentsBlock(document);
      createRelatedProductsBlock(document);
      createProductLiteratureBlock(document);
      createMetadata(main, document);
  
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
        document, url, html, params,
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