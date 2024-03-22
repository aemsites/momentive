import {
  buildBlock,
  decorateBlock,
  loadBlock,
  readBlockConfig,
  createElement,
} from '../../scripts/aem.js';

export default async function decorate(block) {
  const config = readBlockConfig(block);
  const firstSectionName = config['first-section-name'] || false;
  const includeToc = config.toc || false;
  const body = config.body || false;
  const embed = config.embed || false;

  document.body.classList.add('with-left-rail');
  // Build out left rail, starting with the toggle
  const railContent = createElement('div', { class: 'rail-content' });
  const rail = createElement('div', {}, createElement('label', { for: 'left-rail-toggle', class: 'left-rail-toggle' }, '\uf550'), createElement('input', { type: 'checkbox', id: 'left-rail-toggle' }), railContent);

  if (includeToc) {
    const toc = createElement('ul');
    railContent.appendChild(toc);
    if (firstSectionName) {
      // Add an overview link target to the top of the page
      document.querySelector('.section').id = 'top';
      toc.appendChild(createElement('li', {}, createElement('a', { href: '#top' }, firstSectionName)));
    }

    // For each section, find the first h2 or h2 element
    document.querySelectorAll('h2').forEach((header) => {
      toc.appendChild(createElement('li', {}, createElement('a', { href: `#${header.id}` }, header.textContent)));
    });
  }

  if (embed) {
    const fragmentBlock = buildBlock('fragment', `<a href='${embed}'/>`);
    railContent.appendChild(fragmentBlock);
    decorateBlock(fragmentBlock);
    loadBlock(fragmentBlock);
  }

  if (body) {
    railContent.appendChild(body);
  }

  block.replaceChildren(rail);

  // ---- Move all other sections into a sub-div so we can position the rail alongside it all.
  const allSections = [...document.querySelectorAll('main .section')];
  allSections.shift();
  const contentBody = createElement('div', { class: 'content-body' });
  block.parentElement.parentElement.append(contentBody);
  contentBody.appendChild(block.parentElement);
  const mainContent = createElement('div', { class: 'main-content' });
  contentBody.appendChild(mainContent);
  allSections.forEach((section) => {
    mainContent.appendChild(section);
  });

  return block;
}
