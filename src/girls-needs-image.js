import p00a from './girls-needs-image/p00a.js';
import p00b from './girls-needs-image/p00b.js';
import p00c from './girls-needs-image/p00c.js';
import p01 from './girls-needs-image/p01.js';
import p02 from './girls-needs-image/p02.js';
import p03 from './girls-needs-image/p03.js';
import p04 from './girls-needs-image/p04.js';
import p05 from './girls-needs-image/p05.js';
import p06a from './girls-needs-image/p06a.js';
import p06b from './girls-needs-image/p06b.js';
import p06c from './girls-needs-image/p06c.js';
import p07a from './girls-needs-image/p07a.js';
import p07b from './girls-needs-image/p07b.js';
import p07c from './girls-needs-image/p07c.js';
import p08 from './girls-needs-image/p08.js';

const GIRLS_NEEDS_IMAGE = `data:image/jpeg;base64,${[
  p00a,
  p00b,
  p00c,
  p01,
  p02,
  p03,
  p04,
  p05,
  p06a,
  p06b,
  p06c,
  p07a,
  p07b,
  p07c,
  p08,
].join('')}`;

const REPLACEMENT_TITLE = 'Hard Skills vs Soft Skills';

function syncGirlsNeedsCard() {
  const card = document.querySelector('#thumbnail-work-section .tw-card--girls');
  const cardImage = card?.querySelector('img');
  if (!card || !cardImage) return false;

  if (cardImage.dataset.src !== GIRLS_NEEDS_IMAGE) {
    cardImage.dataset.src = GIRLS_NEEDS_IMAGE;
  }
  if (cardImage.src !== GIRLS_NEEDS_IMAGE) {
    cardImage.src = GIRLS_NEEDS_IMAGE;
  }

  const title = card.querySelector('.tw-name');
  if (title && title.textContent !== REPLACEMENT_TITLE) {
    title.textContent = REPLACEMENT_TITLE;
  }

  card.setAttribute(
    'aria-label',
    `${REPLACEMENT_TITLE}, Lifestyle / Comparison. Open thumbnail.`
  );

  return true;
}

function syncGirlsNeedsLightbox() {
  const lightbox = document.querySelector('.tw-lightbox');
  const title = lightbox?.querySelector('.tw-lightbox__title');
  const image = lightbox?.querySelector('.tw-lightbox__image');

  if (!lightbox || !title || !image) return;

  const currentTitle = title.textContent?.trim();
  if (currentTitle !== 'Girls Needs' && currentTitle !== REPLACEMENT_TITLE) return;

  if (image.src !== GIRLS_NEEDS_IMAGE) {
    image.src = GIRLS_NEEDS_IMAGE;
  }
  if (title.textContent !== REPLACEMENT_TITLE) {
    title.textContent = REPLACEMENT_TITLE;
  }
}

let attempts = 0;
const trySyncGirlsNeedsCard = () => {
  attempts += 1;
  if (syncGirlsNeedsCard() || attempts > 100) return;
  window.setTimeout(trySyncGirlsNeedsCard, 80);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', trySyncGirlsNeedsCard, { once: true });
} else {
  trySyncGirlsNeedsCard();
}

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  if (!event.target.closest('.tw-card--girls')) return;
  window.setTimeout(syncGirlsNeedsLightbox, 0);
});
