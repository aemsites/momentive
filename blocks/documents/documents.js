import {
  fetchPlaceholders,
  createElement,
} from '../../scripts/aem.js';

async function decorateTechnicalDocuments(block) {
  const placeholders = await fetchPlaceholders();
  const documents = [...block.querySelectorAll('a')];
  documents.unshift(createElement('h2', { id: 'technical-documents' }, placeholders.technicalDocuments));
  return documents;
}

async function decorateProductDocuments(block) {
  const placeholders = await fetchPlaceholders();
  const documents = [...block.querySelectorAll('a')].map((document) => {
    // check if link ends with pdf
    const isPdf = document.href.endsWith('.pdf');
    const icon = createElement('i', { class: `fas fa-file${isPdf ? '-pdf' : ''}` });
    const link = createElement('a', { href: document.href, class: isPdf ? 'show-download' : '' }, icon, document.textContent);
    if (isPdf) {
      link.setAttribute('download', '');
    }
    return createElement('div', { class: 'document' }, link);
  });
  const header = createElement('h2', { id: 'product-literature' }, placeholders.productLiterature);
  const downloadAll = createElement('a', { href: '#', class: 'download-all' }, placeholders.downloadAll);
  downloadAll.addEventListener('click', (event) => {
    event.preventDefault();
    documents.forEach((document) => {
      const link = document.querySelector('a');
      if (link.classList.contains('show-download')) {
        link.click();
      }
    });
  });
  return createElement('div', {}, header, createElement('div', { class: 'documents' }, ...documents, downloadAll));
}

export default async function decorate(block) {
  // Identify the block style variant
  if (block.classList.contains('technical')) {
    block.replaceChildren(...await decorateTechnicalDocuments(block));
  } else if (block.classList.contains('product')) {
    block.replaceChildren(await decorateProductDocuments(block));
  }
}
