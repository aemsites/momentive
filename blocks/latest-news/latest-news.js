import {
  buildBlock,
  decorateBlock,
  loadBlock,
  createElement,
} from '../../scripts/aem.js';

function extractAndRemoveVideoURL(block) {
  const elem = block.querySelector('.news-media-wrapper a');
  let url = '';
  if (elem !== undefined) {
    url = elem.href;
    elem.parentNode.remove();
  }
  return url;
}

function loadVideo(target, videoURL) {
  // Build the embed block
  const embedBlock = buildBlock('embed', `<a href='${videoURL}'/>`);

  // remove all children of any type of the target
  target.querySelector('picture').parentNode.remove();
  target.querySelector('.play-button').remove();

  // Append the embed block to the target
  target.insertBefore(embedBlock, target.firstChild);

  // load the video
  decorateBlock(embedBlock);
  loadBlock(embedBlock);
}

export default function decorate(block) {
  // assign class identifiers to the block children
  block.children[0].classList.add('news-heading-wrapper');
  block.children[0].children[0].classList.add('news-heading');
  block.children[0].children[0].children[0].classList.add('news-title');
  block.children[1].classList.add('news-media-wrapper');
  block.children[1].children[0].classList.add('news-media-video');
  block.children[1].children[0].lastElementChild.classList.add('news-media-title');
  const newsMedia = block.children[1].children[1];
  newsMedia.classList.add('news-media-content');

  // moving the new-media-text to a new newsMediaInfo div
  const newsMediaInfo = createElement('div', { class: 'news-media-info' });
  for (let i = 0; i <= newsMedia.children.length; i += 1) {
    newsMediaInfo.appendChild(newsMedia.children[1]);
  }
  newsMediaInfo.children[0].classList.add('news-media-text');
  newsMedia.appendChild(newsMediaInfo);

  // extract & remove the video URL
  const videoURL = extractAndRemoveVideoURL(block);

  // Append player quick actons to the video picture
  const playButton = createElement('span', { class: 'play-button' }, '\u25B6');
  block.children[1].children[0].appendChild(playButton);

  // register the click event to load the video
  block.querySelector('.news-media-video picture').addEventListener('click', () => loadVideo(block.getElementsByClassName('news-media-video')[0], videoURL));
  block.querySelector('.news-media-video .play-button').addEventListener('click', () => loadVideo(block.getElementsByClassName('news-media-video')[0], videoURL));
}
