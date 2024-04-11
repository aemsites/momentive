export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    if (row.children.length > 1) {
      // treat the first image as background image only when -
      // if there are more than one children, and
      // if the first child is a picture element
      const pic = (row.firstElementChild !== null) ? row.firstElementChild.firstElementChild.querySelector('picture') : null;
      if (pic !== null) {
        const imgSrc = pic.querySelector('img').src;
        pic.parentElement.parentElement.setAttribute('data-bg-img', imgSrc);
        pic.parentElement.parentElement.setAttribute('style', `background-image:url('${imgSrc}');background-repeat: round;`);
        pic.remove();
      }
    }
    [...row.children].forEach((col) => {
      if (col.children.length > 1) {
        for (let i = 0; i < col.children.length; i += 1) {
          col.children[i].classList.add('column-grid-content');
        }
      }
    });
  });
}
