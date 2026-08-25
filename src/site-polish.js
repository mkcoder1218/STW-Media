const thumbnailWorks = [
  {
    title: 'Dark Side of Money',
    category: 'Finance / Curiosity Hook',
    image: '/thumbnail-work/dark-side-money.jpg',
    className: 'tw-card tw-card--dark',
    rotate: -0.45,
    motion: { x: -18, y: 28, drift: -10 },
  },
  {
    title: 'Girls Needs',
    category: 'Lifestyle / Comparison',
    image: '/thumbnail-work/girls-needs.jpg',
    className: 'tw-card tw-card--girls',
    rotate: 0.35,
    motion: { x: 20, y: 34, drift: 12 },
  },
  {
    title: 'Boys Needs',
    category: 'Lifestyle / Comparison',
    image: '/thumbnail-work/boys-needs.jpg',
    className: 'tw-card tw-card--boys',
    rotate: -0.3,
    motion: { x: -22, y: 40, drift: 10 },
  },
  {
    title: 'Claude in Asia',
    category: 'Tech / Explainer',
    image: '/thumbnail-work/claude-asia.jpg',
    className: 'tw-card tw-card--claude',
    rotate: 0.35,
    motion: { x: 16, y: 30, drift: -10 },
  },
  {
    title: "Why You Can't Fall Asleep",
    category: 'Educational / Human Hook',
    image: '/thumbnail-work/fall-asleep.jpg',
    className: 'tw-card tw-card--sleep',
    rotate: -0.35,
    motion: { x: -16, y: 34, drift: 10 },
  },
];

const style = document.createElement('style');
style.textContent = `
  /* Keep the GSAP hero visible when Motion's in-view state changes after a long scroll. */
  .stw-gsap-hero .stw-hero-copy-stable {
    opacity: 1 !important;
    visibility: visible !important;
  }

  #thumbnail-work-section {
    position: relative;
    overflow: clip;
    padding: clamp(76px, 8vw, 132px) 24px clamp(96px, 9vw, 154px);
    background:
      radial-gradient(circle at 12% 24%, rgba(0, 153, 255, .10), transparent 25%),
      radial-gradient(circle at 88% 72%, rgba(0, 153, 255, .07), transparent 28%),
      #0b0d0e;
    border-top: 1px solid rgba(255,255,255,.06);
    border-bottom: 1px solid rgba(255,255,255,.06);
    content-visibility: auto;
    contain-intrinsic-size: auto 1100px;
  }

  .tw-shell { max-width: 1280px; margin: 0 auto; }
  .tw-header {
    display: grid;
    grid-template-columns: minmax(0,1.2fr) minmax(260px,.8fr);
    gap: 42px;
    align-items: end;
    margin-bottom: clamp(48px, 6vw, 82px);
  }
  .tw-kicker {
    display: block;
    color: #0099ff;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: .27em;
    text-transform: uppercase;
    margin-bottom: 14px;
  }
  .tw-title {
    margin: 0;
    color: white;
    font-family: inherit;
    font-size: clamp(42px,6vw,78px);
    line-height: .94;
    letter-spacing: -.045em;
    font-weight: 900;
    max-width: 760px;
  }
  .tw-copy {
    margin: 0;
    color: rgba(235,239,242,.62);
    font-size: clamp(15px,1.45vw,18px);
    line-height: 1.65;
    max-width: 480px;
    justify-self: end;
  }

  .tw-wall {
    position: relative;
    display: grid;
    grid-template-columns: repeat(12,minmax(0,1fr));
    column-gap: clamp(16px, 2vw, 24px);
    row-gap: clamp(38px, 5vw, 68px);
    align-items: start;
    min-height: 0;
  }

  .tw-card {
    --tw-x: 0px;
    --tw-y: 0px;
    --tw-scroll-rotate: 0deg;
    --tw-hover-y: 0px;
    --tw-hover-scale: 1;
    --tw-rotate: 0deg;
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border-radius: clamp(16px, 1.8vw, 22px);
    border: 1px solid rgba(255,255,255,.12);
    background:
      linear-gradient(115deg, rgba(255,255,255,.045), transparent 35%),
      #111;
    box-shadow: 0 28px 70px rgba(0,0,0,.42);
    cursor: zoom-in;
    opacity: 0;
    isolation: isolate;
    contain: layout paint style;
    transform:
      translate3d(var(--tw-x), calc(var(--tw-y) + var(--tw-hover-y)), 0)
      rotate(calc(var(--tw-rotate) + var(--tw-scroll-rotate)))
      scale(var(--tw-hover-scale));
    transform-origin: center center;
    transition:
      opacity .5s ease,
      border-color .3s ease,
      box-shadow .3s ease,
      transform .28s ease;
    backface-visibility: hidden;
  }

  .tw-card.is-motion-active { will-change: transform; }
  .tw-card.is-visible { opacity: 1; }

  .tw-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    opacity: 0;
    transform: scale(1.012);
    transition: opacity .3s ease, transform .7s cubic-bezier(.22,1,.36,1);
    image-rendering: auto;
    backface-visibility: hidden;
  }
  .tw-card.is-loaded img { opacity: 1; transform: scale(1); }

  .tw-card::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    background: linear-gradient(110deg, rgba(255,255,255,.035), rgba(255,255,255,.075), rgba(255,255,255,.035));
    background-size: 220% 100%;
    animation: twShimmer 1.5s linear infinite;
    opacity: .45;
  }
  .tw-card.is-loaded::before { display: none; }

  @keyframes twShimmer {
    from { background-position: 160% 0; }
    to { background-position: -60% 0; }
  }

  .tw-card::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(to top, rgba(0,0,0,.76), rgba(0,0,0,.04) 48%, transparent 70%);
    opacity: .62;
    transition: opacity .3s ease;
    pointer-events: none;
  }

  .tw-card:hover,
  .tw-card:focus-visible {
    z-index: 20;
    --tw-hover-y: -8px;
    --tw-hover-scale: 1.01;
    border-color: rgba(0,153,255,.72);
    box-shadow: 0 40px 95px rgba(0,0,0,.58), 0 0 0 1px rgba(0,153,255,.14);
    outline: none;
  }
  .tw-card:hover::after,
  .tw-card:focus-visible::after { opacity: .82; }

  .tw-meta {
    position: absolute;
    left: clamp(15px, 2vw, 22px);
    right: clamp(15px, 2vw, 22px);
    bottom: clamp(14px, 1.8vw, 20px);
    z-index: 2;
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 16px;
    transform: translateY(6px);
    opacity: .78;
    transition: transform .3s ease, opacity .3s ease;
    pointer-events: none;
  }
  .tw-card:hover .tw-meta,
  .tw-card:focus-visible .tw-meta { transform: translateY(0); opacity: 1; }
  .tw-index { color:#0099ff; font-size:11px; font-weight:900; letter-spacing:.22em; text-transform:uppercase; }
  .tw-name { color:white; font-size:clamp(16px,1.65vw,23px); font-weight:850; letter-spacing:-.02em; margin-top:4px; }
  .tw-type { color:rgba(255,255,255,.68); font-size:10px; font-weight:750; letter-spacing:.12em; text-transform:uppercase; text-align:right; max-width:155px; }

  /* Native 16:9 cards: no vertical stretching/cropping. */
  .tw-card--dark   { grid-column: 1 / span 4; grid-row: 1; margin-top: clamp(24px, 4vw, 54px); }
  .tw-card--girls  { grid-column: 7 / span 6; grid-row: 1; }
  .tw-card--boys   { grid-column: 3 / span 7; grid-row: 2; }
  .tw-card--claude { grid-column: 1 / span 4; grid-row: 3; margin-top: 8px; }
  .tw-card--sleep  { grid-column: 8 / span 5; grid-row: 3; margin-top: clamp(20px, 4vw, 52px); }

  .tw-footnote {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 38px;
    color: rgba(255,255,255,.35);
    text-transform: uppercase;
    letter-spacing: .18em;
    font-size: 10px;
    font-weight: 800;
  }
  .tw-dot { width:6px; height:6px; border-radius:50%; background:#0099ff; box-shadow:0 0 14px rgba(0,153,255,.75); }

  .tw-lightbox {
    position: fixed;
    inset: 0;
    z-index: 180;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px;
    background: rgba(0,0,0,.9);
    backdrop-filter: blur(18px);
    opacity: 0;
    pointer-events: none;
    transition: opacity .22s ease;
  }
  .tw-lightbox.is-open { opacity:1; pointer-events:auto; }
  .tw-lightbox__frame { position:relative; width:min(1160px,94vw); transform:translateY(12px); transition:transform .3s cubic-bezier(.22,1,.36,1); }
  .tw-lightbox.is-open .tw-lightbox__frame { transform:translateY(0); }
  .tw-lightbox__image {
    display:block;
    width:auto;
    max-width:94vw;
    max-height:82vh;
    margin:0 auto;
    object-fit:contain;
    border-radius:22px;
    border:1px solid rgba(255,255,255,.15);
    box-shadow:0 40px 120px rgba(0,0,0,.75);
    background:#080909;
  }
  .tw-lightbox__bar { margin-top:14px; display:flex; align-items:center; justify-content:space-between; gap:16px; color:white; }
  .tw-lightbox__title { font-size:18px; font-weight:850; }
  .tw-lightbox__type { color:rgba(255,255,255,.5); font-size:11px; letter-spacing:.14em; text-transform:uppercase; font-weight:800; }
  .tw-close { position:absolute; top:-54px; right:0; width:42px; height:42px; border-radius:999px; border:1px solid rgba(255,255,255,.16); background:rgba(15,15,15,.75); color:white; font-size:23px; line-height:1; cursor:pointer; backdrop-filter:blur(10px); }

  @media (max-width: 900px) {
    #thumbnail-work-section { padding-left:18px; padding-right:18px; contain-intrinsic-size: auto 1400px; }
    .tw-header { grid-template-columns:1fr; gap:20px; }
    .tw-copy { justify-self:start; }
    .tw-wall { grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }
    .tw-card {
      grid-column:auto !important;
      grid-row:auto !important;
      margin-top:0 !important;
      --tw-rotate:0deg !important;
      --tw-scroll-rotate:0deg !important;
    }
    .tw-card--boys { grid-column:1 / -1 !important; }
  }

  @media (max-width: 620px) {
    .tw-wall { grid-template-columns:1fr; }
    .tw-card--boys { grid-column:auto !important; }
    .tw-type { display:none; }
  }

  @media (prefers-reduced-motion: reduce) {
    .tw-card { opacity:1; transform:none !important; transition:none !important; }
    .tw-card::before { animation:none; }
    .tw-card img { transform:none !important; transition:none !important; }
    .tw-lightbox, .tw-lightbox__frame { transition:none !important; }
  }
`;
document.head.appendChild(style);

let thumbnailSection = null;
let thumbnailCards = [];
let motionRaf = 0;
let sectionIsActive = false;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function stabilizeHero() {
  const hero = document.querySelector('#root main section');
  if (!hero || hero.dataset.gsapHeroReady !== 'true') return false;

  const heading = hero.querySelector('h1');
  const copyColumn = heading?.parentElement;
  if (!copyColumn) return false;

  copyColumn.classList.add('stw-hero-copy-stable');
  return true;
}

function watchHeroUntilReady() {
  if (stabilizeHero()) return;

  const observer = new MutationObserver(() => {
    if (stabilizeHero()) observer.disconnect();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'data-gsap-hero-ready'],
  });

  window.setTimeout(() => observer.disconnect(), 8000);
}

function updateScrollMotion() {
  motionRaf = 0;
  if (!thumbnailSection || !sectionIsActive || reducedMotion || window.innerWidth < 901) return;

  const rect = thumbnailSection.getBoundingClientRect();
  const viewport = window.innerHeight;
  const travel = rect.height + viewport;
  const progress = clamp((viewport - rect.top) / travel, 0, 1);
  const phase = progress * 2 - 1;

  thumbnailCards.forEach(({ element, work, index }) => {
    const x = Math.round(phase * work.motion.x);
    const y = Math.round(phase * -work.motion.y);
    const localWave = Math.sin((progress * Math.PI * 1.2) + index * 0.78);
    const drift = Math.round(localWave * work.motion.drift);
    const rotate = (phase * work.rotate * 0.34).toFixed(2);

    element.style.setProperty('--tw-x', `${x + drift}px`);
    element.style.setProperty('--tw-y', `${y}px`);
    element.style.setProperty('--tw-scroll-rotate', `${rotate}deg`);
  });
}

function requestMotionUpdate() {
  if (!sectionIsActive || motionRaf) return;
  motionRaf = window.requestAnimationFrame(updateScrollMotion);
}

const lightbox = document.createElement('div');
lightbox.className = 'tw-lightbox';
lightbox.setAttribute('role', 'dialog');
lightbox.setAttribute('aria-modal', 'true');
lightbox.setAttribute('aria-label', 'Thumbnail preview');
lightbox.innerHTML = `
  <div class="tw-lightbox__frame">
    <button class="tw-close" type="button" aria-label="Close thumbnail preview">×</button>
    <img class="tw-lightbox__image" alt="" decoding="async" />
    <div class="tw-lightbox__bar">
      <div class="tw-lightbox__title"></div>
      <div class="tw-lightbox__type"></div>
    </div>
  </div>
`;
document.body.appendChild(lightbox);

function closeLightbox() {
  lightbox.classList.remove('is-open');
  document.body.style.removeProperty('overflow');
}

function openLightbox(work) {
  const image = lightbox.querySelector('.tw-lightbox__image');
  image.src = work.image;
  image.alt = `${work.title} thumbnail design`;
  lightbox.querySelector('.tw-lightbox__title').textContent = work.title;
  lightbox.querySelector('.tw-lightbox__type').textContent = work.category;
  lightbox.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  lightbox.querySelector('.tw-close').focus();
}

lightbox.querySelector('.tw-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
});

function buildShowcase() {
  if (document.getElementById('thumbnail-work-section')) return true;

  const clientsSection = document.getElementById('clients-section');
  if (!clientsSection) return false;

  const section = document.createElement('section');
  section.id = 'thumbnail-work-section';
  section.setAttribute('aria-label', 'Thumbnail creative work');
  section.innerHTML = `
    <div class="tw-shell">
      <div class="tw-header">
        <div>
          <span class="tw-kicker">Thumbnail Work</span>
          <h2 class="tw-title">Ideas built to stop the scroll.</h2>
        </div>
        <p class="tw-copy">A mix of curiosity, comparison, explainer, and human-led concepts. Different visual worlds, one job: earn the click before the video even starts.</p>
      </div>
      <div class="tw-wall" role="list"></div>
      <div class="tw-footnote"><span class="tw-dot"></span> Scroll through the creative wall · thumbnail design · visual hooks</div>
    </div>
  `;

  const wall = section.querySelector('.tw-wall');
  thumbnailCards = [];

  const loadImage = (article) => {
    const image = article.querySelector('img[data-src]');
    if (!image || image.dataset.loaded === 'true') return;

    image.dataset.loaded = 'true';
    image.addEventListener('load', () => article.classList.add('is-loaded'), { once: true });
    image.addEventListener('error', () => article.classList.add('is-loaded'), { once: true });
    image.src = image.dataset.src;
  };

  let imageObserver = null;
  if ('IntersectionObserver' in window && !reducedMotion) {
    imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadImage(entry.target);
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '180px 0px', threshold: 0.01 });
  }

  thumbnailWorks.forEach((work, index) => {
    const article = document.createElement('article');
    article.className = work.className;
    article.style.setProperty('--tw-rotate', `${work.rotate}deg`);
    article.setAttribute('role', 'listitem');
    article.setAttribute('tabindex', '0');
    article.setAttribute('aria-label', `${work.title}, ${work.category}. Open thumbnail.`);
    article.innerHTML = `
      <img
        data-src="${work.image}"
        alt="${work.title} thumbnail design"
        width="1280"
        height="720"
        loading="lazy"
        decoding="async"
        fetchpriority="low"
        draggable="false"
      />
      <div class="tw-meta">
        <div>
          <div class="tw-index">${String(index + 1).padStart(2, '0')} / ${String(thumbnailWorks.length).padStart(2, '0')}</div>
          <div class="tw-name">${work.title}</div>
        </div>
        <div class="tw-type">${work.category}</div>
      </div>
    `;

    const open = () => {
      loadImage(article);
      openLightbox(work);
    };

    article.addEventListener('click', open);
    article.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });

    wall.appendChild(article);
    thumbnailCards.push({ element: article, work, index });

    if (imageObserver) {
      imageObserver.observe(article);
    } else {
      loadImage(article);
      article.classList.add('is-visible');
    }
  });

  clientsSection.parentNode.insertBefore(section, clientsSection);
  thumbnailSection = section;

  if ('IntersectionObserver' in window && !reducedMotion) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        sectionIsActive = entry.isIntersecting;
        thumbnailCards.forEach(({ element }) => element.classList.toggle('is-motion-active', sectionIsActive));
        if (sectionIsActive) requestMotionUpdate();
      });
    }, { rootMargin: '18% 0px 18% 0px', threshold: 0.01 });
    sectionObserver.observe(section);
  } else {
    sectionIsActive = true;
  }

  window.addEventListener('scroll', requestMotionUpdate, { passive: true });
  window.addEventListener('resize', requestMotionUpdate, { passive: true });
  requestMotionUpdate();

  return true;
}

watchHeroUntilReady();

if (!buildShowcase()) {
  const observer = new MutationObserver(() => {
    if (buildShowcase()) observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
}
