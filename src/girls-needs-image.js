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

function syncGirlsNeedsImage() {
  const card = document.querySelector('#thumbnail-work-section .tw-card--girls');
  const cardImage = card?.querySelector('img');

  if (cardImage) {
    cardImage.dataset.src = GIRLS_NEEDS_IMAGE;
    if (cardImage.src !== GIRLS_NEEDS_IMAGE) cardImage.src = GIRLS_NEEDS_IMAGE;
  }

  const lightbox = document.querySelector('.tw-lightbox');
  const lightboxTitle = lightbox?.querySelector('.tw-lightbox__title')?.textContent?.trim();
  const lightboxImage = lightbox?.querySelector('.tw-lightbox__image');

  if (lightboxImage && lightboxTitle === 'Girls Needs' && lightboxImage.src !== GIRLS_NEEDS_IMAGE) {
    lightboxImage.src = GIRLS_NEEDS_IMAGE;
  }

  return Boolean(cardImage);
}

let attempts = 0;
const trySyncGirlsNeedsImage = () => {
  attempts += 1;
  if (syncGirlsNeedsImage() || attempts > 100) return;
  window.setTimeout(trySyncGirlsNeedsImage, 80);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', trySyncGirlsNeedsImage, { once: true });
} else {
  trySyncGirlsNeedsImage();
}

const imageObserver = new MutationObserver(() => {
  syncGirlsNeedsImage();
});

imageObserver.observe(document.getElementById('root') || document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['src'],
});

document.addEventListener('click', (event) => {
  if (event.target instanceof Element && event.target.closest('.tw-card--girls')) {
    window.setTimeout(syncGirlsNeedsImage, 0);
  }
});
