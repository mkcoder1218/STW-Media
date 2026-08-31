const SHORT_IDS = ['yFX-BOck9GE', 'pWRUhMqxE_g', 'bvTwYRxedJk'];

function syncShortsContent() {
  const stage = document.querySelector('#shorts-section [data-shorts-stage]');
  if (!stage) return false;

  const cards = [...stage.querySelectorAll('[data-short-card]')];
  if (cards.length !== SHORT_IDS.length) return false;

  cards.forEach((card, index) => {
    const youtubeId = SHORT_IDS[index];
    const iframe = card.querySelector('iframe');
    const badge = card.querySelector('span');
    const title = card.querySelector('h3');

    if (iframe && !iframe.src.includes(`/embed/${youtubeId}?`)) {
      iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&rel=0&playsinline=1`;
      iframe.title = `Short-form Work ${String(index + 1).padStart(2, '0')} — STW Media short-form work`;
    }

    card.setAttribute('data-short-index', String(index));
    if (badge) badge.textContent = `Short ${String(index + 1).padStart(2, '0')}`;
    if (title) title.textContent = `Short-form Work ${String(index + 1).padStart(2, '0')}`;
  });

  return true;
}

let attempts = 0;
const trySyncShortsContent = () => {
  attempts += 1;
  if (syncShortsContent() || attempts > 80) return;
  window.setTimeout(trySyncShortsContent, 80);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', trySyncShortsContent, { once: true });
} else {
  trySyncShortsContent();
}

const shortsContentObserver = new MutationObserver(() => {
  syncShortsContent();
});

shortsContentObserver.observe(document.getElementById('root') || document.documentElement, {
  childList: true,
  subtree: true,
});
