/* eslint-disable object-curly-newline */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import BlockBuilder from './blockBuilder.js';

function stripSingleQuotes(str) {
  if (!str) {
    return str;
  }
  return str.replace(/'(.*?)'/g, '$1');
}

function extractPageMetadata(doc) {
  return {
    title: doc.title,
    description: doc.querySelector('meta[name="description"]')?.content,
    keywords: doc.querySelector('meta[name="keywords"]')?.content,
    industry: stripSingleQuotes(doc.querySelector('meta[name="industry"]')?.content),
    brand: stripSingleQuotes(doc.querySelector('meta[name="brand"]')?.content),
    productCategory: stripSingleQuotes(doc.querySelector('meta[name="productCategory"]')?.content),
    template: 'Product',
  };
}

function convertMarketingBulletin(builder) {
  const bulletin = builder.doc.querySelector('.elc_pdf-download');
  if (!bulletin) {
    return;
  }

  builder.replace(bulletin, () => {
    const image = bulletin.querySelector('img');
    const link = bulletin.querySelector('a');
    link.innerHTML = link.href;
    builder.block('Documents (Bulletin)', 1)
      .append(image)
      .element('br').up()
      .append(link);
  });
}

function convertMomTechnicalDocuments(builder) {
  const techDocuments = builder.doc.querySelector('.elc__tech-document');
  if (!techDocuments) {
    return;
  }
  builder.replace(techDocuments, () => {
    const links = [...techDocuments.querySelectorAll('a')];
    builder.block('Documents (Technical)', 1)
      .element('ul');
    links.forEach((link) => {
      builder.element('li').append(link).up();
    });
  });
}

function convertMomProductLiterature(builder) {
  const productLiterature = builder.doc.querySelector('.elc__product-literature');
  if (!productLiterature) {
    return;
  }
  builder.replace(productLiterature, () => {
    const links = [...productLiterature.querySelectorAll('a')];
    builder.block('Documents (Product)', 1)
      .element('ul');
    links.forEach((link) => {
      builder.element('li').append(link).up();
    });
  });
}

function convertMomProductPage(builder) {
  if (!builder.doc.querySelector('.mom-max-container')) {
    return;
  }
  convertMarketingBulletin(builder);
  convertMomTechnicalDocuments(builder);
  convertMomProductLiterature(builder);
}

function convertPatternedDocuments(builder) {
  if (builder.doc.querySelector('#mediaBlock')) {
    const img = builder.doc.querySelector('#mediaBlock img');
    const link = builder.doc.querySelector('#mediaBlock a');
    link.innerHTML = link.href;
    builder.replace(builder.doc.querySelector('#mediaBlock'), () => {
      builder.block('Documents (Bulletin)', 1)
        .append(img)
        .element('br').up()
        .append(link);
    });
  }
  const technicalDocuments = [];
  const productLiterature = [];

  // Find all technical and product literature links
  builder.doc.querySelectorAll('#dvplain a:not(.sdsDocument)').forEach((a) => {
    technicalDocuments.push(a);
  });
  builder.doc.querySelectorAll('a.sdsDocument, .mydoc a,.mydocuments a').forEach((a) => {
    a.innerHTML = a.textContent;
    productLiterature.push(a);
  });

  // If doc has no dvplain element, append one
  if (technicalDocuments.length > 0) {
    if (!builder.doc.querySelector('#dvplain')) {
      const div = builder.doc.createElement('div');
      div.id = 'dvplain';
      builder.doc.body.append(div);
    }
    builder.replace(builder.doc.querySelector('#dvplain'), () => {
      builder.block('Documents (Technical)', 1).element('ul');
      technicalDocuments.forEach((link) => {
        builder.element('li').append(link).up();
      });
    });
  } else {
    builder.doc.querySelector('#dvplain')?.remove();
  }

  if (productLiterature.length > 0) {
    // If doc has no mydoc element, append one
    if (!builder.doc.querySelector('.mydoc')) {
      const div = builder.doc.createElement('div');
      div.className = 'mydoc';
      builder.doc.body.append(div);
    }
    builder.replace(builder.doc.querySelector('.mydoc'), () => {
      builder.block('Documents (Product)', 1).element('ul');
      productLiterature.forEach((link) => {
        builder.element('li').append(link).up();
      });
    });
  }
}

function convertPatternedProductPage(builder) {
  if (!builder.doc.querySelector('.product-detail-top.bg-pattern-sm')) {
    return;
  }
  convertMarketingBulletin(builder);
  convertPatternedDocuments(builder);
}

export default {
  transformDOM: ({ document, url, html, params }) => {
    const metadata = extractPageMetadata(document);

    WebImporter.DOMUtils.remove(document.body, [
      '.aside',
      '.aside-cookie-info',
      '.breadcrumb',
      '.bredcrumb', // [sic]
      '.cookie-banner',
      '.elc_explore-button',
      '.embeddedServiceHelpButton',
      '.mydoc+.mydocuments',
      '.scroll-anchor',
      '.slide-in-container',
      '#btnProdLit',
      '#disclaimer',
      '#divRelatedProducts',
      '#downloadallproductliterature',
      '#feedback',
      '#fileUploadForm',
      '#gatedContentRequestForm',
      '#hdn-banner-msg-flag',
      '#hdIsLimitedAccessLang',
      '#loadingpanel',
      '#tracking-consent-dialog',
      'footer',
      'header',
      'h4.bg-orange-medium-sm',
      'div.pad-sm-4-3.pad-md-3-4:has(h6)',
      'iframe',
      'noscript',
    ]);

    const builder = new BlockBuilder(document, metadata);

    convertMomProductPage(builder);
    convertPatternedProductPage(builder);

    builder.finish();
    return document.body;
  },

  generateDocumentPath: ({ document, url, html, params }) => WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')),

};
