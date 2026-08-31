const SHORT_IDS = ['yFX-BOck9GE', 'pWRUhMqxE_g', 'bvTwYRxedJk'];
const SHORTS_SECTION_ID = 'shorts-section';

const posterStyle = document.createElement('style');
posterStyle.textContent = `
  #${SHORTS_SECTION_ID} .stw-short-poster {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    background: #050607;
    pointer-events: none;
  }
`;
document.head.appendChild(posterStyle);

let section = null;
let cards = [];
let activeIndex = -2;
let scrollRaf = 0;
let attempts = 0;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function buildEmbedUrl(youtubeId) {
  const autoplay = reducedMotion ? 0 : 1;
  return `https://www.youtube.com/embed/${youtubeId}?autoplay=${autoplay}&mute=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&rel=0&playsinline=1`;
}

function ensurePoster(card, youtubeId) {
  let poster = card.querySelector('.stw-short-poster');
  if (!poster) {
    poster = document.createElement('img');
    poster.className = 'stw-short-poster';
    poster.alt = '';
    poster.loading = 'lazy';
    poster.decoding = 'async';

    const device = card.querySelector('.stw-short-device');
    const iframe = card.querySelector('iframe');
    if (device && iframe) device.insertBefore(poster, iframe);
  }

  const posterUrl = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
  if (poster && poster.getAttribute('src') !== posterUrl) poster.setAttribute('src', posterUrl);
  return poster;
}

function syncStaticContent() {
  section = document.getElementById(SHORTS_SECTION_ID);
  if (!section) return false;

  const stage = section.querySelector('[data-shorts-stage]');
  if (!stage) return false;

  cards = [...stage.querySelectorAll('[data-short-card]')];
  if (cards.length !== SHORT_IDS.length) return false;

  cards.forEach((card, index) => {
    const youtubeId = SHORT_IDS[index];
    const badge = card.querySelector('span');
    const title = card.querySelector('h3');

    const expectedIndex = String(index);
    const expectedBadge = `Short ${String(index + 1).padStart(2, '0')}`;
    const expectedTitle = `Short-form Work ${String(index + 1).padStart(2, '0')}`;

    if (card.getAttribute('data-short-index') !== expectedIndex) {
      card.setAttribute('data-short-index', expectedIndex);
    }
    if (badge && badge.textContent !== expectedBadge) badge.textContent = expectedBadge;
    if (title && title.textContent !== expectedTitle) title.textContent = expectedTitle;

    ensurePoster(card, youtubeId);
  });

  return true;
}

function setActiveVideo(nextIndex) {
  if (nextIndex === activeIndex) return;
  activeIndex = nextIndex;

  cards.forEach((card, index) => {
    const iframe = card.querySelector('iframe');
    const poster = card.querySelector('.stw-short-poster');
    if (!iframe) return;

    if (index === nextIndex) {
      const desiredUrl = buildEmbedUrl(SHORT_IDS[index]);
      if (!iframe.src.includes(`/embed/${SHORT_IDS[index]}?`)) iframe.src = desiredUrl;
      iframe.style.visibility = 'visible';
      if (poster) poster.style.visibility = 'hidden';
    } else {
      if (iframe.getAttribute('src') !== 'about:blank') iframe.setAttribute('src', 'about:blank');
      iframe.style.visibility = 'hidden';
      if (poster) poster.style.visibility = 'visible';
    }
  });
}

function updateActiveVideo() {
  scrollRaf = 0;
  if (!section || !cards.length) return;

  const rect = section.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  if (rect.bottom <= 0 || rect.top >= viewportHeight) {
    setActiveVideo(-1);
    return;
  }

  const travel = Math.max(1, section.offsetHeight - viewportHeight);
  const progress = Math.min(1, Math.max(0, -rect.top / travel));
  const nextIndex = Math.min(cards.length - 1, Math.max(0, Math.round(progress * (cards.length - 1))));
  setActiveVideo(nextIndex);
}

function requestActiveVideoUpdate() {
  if (scrollRaf) return;
  scrollRaf = window.requestAnimationFrame(updateActiveVideo);
}

function startShortsContent() {
  attempts += 1;

  if (!syncStaticContent()) {
    if (attempts <= 80) window.setTimeout(startShortsContent, 80);
    return;
  }

  // Important: no MutationObserver here. The previous observer wrote back into
  // the same subtree it watched, creating a self-triggering DOM mutation loop.
  updateActiveVideo();
  window.addEventListener('scroll', requestActiveVideoUpdate, { passive: true });
  window.addEventListener('resize', requestActiveVideoUpdate, { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startShortsContent, { once: true });
} else {
  startShortsContent();
}
