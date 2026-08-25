const thumbnailWorks = [
  {
    title: 'Dark Side of Money',
    category: 'Finance / Curiosity Hook',
    image: '/thumbnail-work/dark-side-money.jpg',
    className: 'tw-card tw-card--dark tw-card--compact',
    rotate: -1.1,
    motion: { x: -34, y: 72, drift: -24 },
  },
  {
    title: 'Girls Needs',
    category: 'Lifestyle / Comparison',
    image: '/thumbnail-work/girls-needs.jpg',
    className: 'tw-card tw-card--girls',
    rotate: 0.8,
    motion: { x: 46, y: 104, drift: 30 },
  },
  {
    title: 'Boys Needs',
    category: 'Lifestyle / Comparison',
    image: '/thumbnail-work/boys-needs.jpg',
    className: 'tw-card tw-card--boys',
    rotate: -0.65,
    motion: { x: -52, y: 132, drift: 18 },
  },
  {
    title: 'Claude in Asia',
    category: 'Tech / Explainer',
    image: '/thumbnail-work/claude-asia.jpg',
    className: 'tw-card tw-card--claude tw-card--compact',
    rotate: 0.7,
    motion: { x: 38, y: 92, drift: -26 },
  },
  {
    title: "Why You Can't Fall Asleep",
    category: 'Educational / Human Hook',
    image: '/thumbnail-work/fall-asleep.jpg',
    className: 'tw-card tw-card--sleep tw-card--compact',
    rotate: -0.75,
    motion: { x: -30, y: 116, drift: 22 },
  },
];

const style = document.createElement('style');
style.textContent = `
  #thumbnail-work-section {
    position: relative;
    overflow: clip;
    padding: clamp(82px, 9vw, 150px) 24px clamp(120px, 12vw, 210px);
    background:
      radial-gradient(circle at 12% 24%, rgba(0, 153, 255, .12), transparent 25%),
      radial-gradient(circle at 88% 72%, rgba(0, 153, 255, .08), transparent 28%),
      #0b0d0e;
    border-top: 1px solid rgba(255,255,255,.06);
    border-bottom: 1px solid rgba(255,255,255,.06);
  }

  .tw-shell { max-width: 1280px; margin: 0 auto; }
  .tw-header {
    display: grid;
    grid-template-columns: minmax(0,1.2fr) minmax(260px,.8fr);
    gap: 42px;
    align-items: end;
    margin-bottom: clamp(60px, 8vw, 108px);
  }
  .tw-kicker {
    display:block;
    color:#0099ff;
    font-size:12px;
    font-weight:800;
    letter-spacing:.27em;
    text-transform:uppercase;
    margin-bottom:14px;
  }
  .tw-title {
    margin:0;
    color:white;
    font-family:inherit;
    font-size:clamp(42px,6vw,78px);
    line-height:.94;
    letter-spacing:-.045em;
    font-weight:900;
    max-width:760px;
  }
  .tw-copy {
    margin:0;
    color:rgba(235,239,242,.62);
    font-size:clamp(15px,1.45vw,18px);
    line-height:1.65;
    max-width:480px;
    justify-self:end;
  }

  .tw-wall {
    position:relative;
    display:grid;
    grid-template-columns:repeat(12,minmax(0,1fr));
    grid-auto-rows:42px;
    gap:20px;
    min-height:1190px;
  }

  .tw-card {
    --tw-x: 0px;
    --tw-y: 0px;
    --tw-scroll-rotate: 0deg;
    --tw-hover-y: 0px;
    --tw-hover-scale: 1;
    --tw-rotate: 0deg;
    position:relative;
    overflow:hidden;
    border-radius:22px;
    border:1px solid rgba(255,255,255,.12);
    background:#111;
    box-shadow:0 28px 70px rgba(0,0,0,.42);
    cursor:zoom-in;
    opacity:0;
    isolation:isolate;
    transform:
      translate3d(var(--tw-x), calc(var(--tw-y) + var(--tw-hover-y)), 0)
      rotate(calc(var(--tw-rotate) + var(--tw-scroll-rotate)))
      scale(var(--tw-hover-scale));
    transform-origin:center center;
    transition:
      opacity .65s ease,
      border-color .3s ease,
      box-shadow .3s ease,
      --tw-hover-y .3s ease,
      --tw-hover-scale .3s ease;
    will-change:transform;
    backface-visibility:hidden;
  }
  .tw-card.is-visible { opacity:1; }

  .tw-card img {
    width:100%;
    height:100%;
    object-fit:cover;
    display:block;
    transform:none !important;
    filter:none !important;
    image-rendering:auto;
    backface-visibility:hidden;
  }

  .tw-card::after {
    content:'';
    position:absolute;
    inset:0;
    background:linear-gradient(to top, rgba(0,0,0,.76), rgba(0,0,0,.04) 48%, transparent 70%);
    opacity:.62;
    transition:opacity .3s ease;
    pointer-events:none;
  }

  .tw-card:hover,
  .tw-card:focus-visible {
    z-index:20;
    --tw-hover-y:-10px;
    --tw-hover-scale:1.012;
    border-color:rgba(0,153,255,.72);
    box-shadow:0 40px 95px rgba(0,0,0,.58),0 0 0 1px rgba(0,153,255,.14);
    outline:none;
  }
  .tw-card:hover::after,
  .tw-card:focus-visible::after { opacity:.84; }

  .tw-meta {
    position:absolute;
    left:22px;
    right:22px;
    bottom:20px;
    z-index:2;
    display:flex;
    align-items:end;
    justify-content:space-between;
    gap:16px;
    transform:translateY(7px);
    opacity:.76;
    transition:transform .3s ease, opacity .3s ease;
    pointer-events:none;
  }
  .tw-card:hover .tw-meta,
  .tw-card:focus-visible .tw-meta { transform:translateY(0); opacity:1; }
  .tw-index { color:#0099ff; font-size:11px; font-weight:900; letter-spacing:.22em; text-transform:uppercase; }
  .tw-name { color:white; font-size:clamp(17px,2vw,25px); font-weight:850; letter-spacing:-.02em; margin-top:4px; }
  .tw-type { color:rgba(255,255,255,.68); font-size:11px; font-weight:750; letter-spacing:.12em; text-transform:uppercase; text-align:right; max-width:165px; }

  /* High-resolution comparison pieces get the largest canvas. */
  .tw-card--girls { grid-column:7 / span 6; grid-row:1 / span 9; }
  .tw-card--boys { grid-column:3 / span 7; grid-row:10 / span 10; }

  /* Smaller source thumbnails deliberately stay physically smaller so they stay crisp. */
  .tw-card--dark { grid-column:1 / span 4; grid-row:2 / span 6; }
  .tw-card--claude { grid-column:1 / span 4; grid-row:21 / span 6; }
  .tw-card--sleep { grid-column:8 / span 5; grid-row:21 / span 7; }

  .tw-footnote {
    display:flex;
    align-items:center;
    gap:10px;
    margin-top:42px;
    color:rgba(255,255,255,.35);
    text-transform:uppercase;
    letter-spacing:.18em;
    font-size:10px;
    font-weight:800;
  }
  .tw-dot { width:6px; height:6px; border-radius:50%; background:#0099ff; box-shadow:0 0 14px rgba(0,153,255,.75); }

  .tw-lightbox {
    position:fixed;
    inset:0;
    z-index:180;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:28px;
    background:rgba(0,0,0,.9);
    backdrop-filter:blur(18px);
    opacity:0;
    pointer-events:none;
    transition:opacity .22s ease;
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
    #thumbnail-work-section { padding-left:18px; padding-right:18px; }
    .tw-header { grid-template-columns:1fr; gap:20px; }
    .tw-copy { justify-self:start; }
    .tw-wall { grid-template-columns:repeat(2,minmax(0,1fr)); grid-auto-rows:auto; min-height:0; gap:16px; }
    .tw-card {
      grid-column:auto !important;
      grid-row:auto !important;
      aspect-ratio:16/9;
      border-radius:17px;
      --tw-rotate:0deg !important;
      --tw-scroll-rotate:0deg !important;
    }
    .tw-card--boys { grid-column:1 / -1 !important; }
  }
  @media (max-width: 620px) {
    .tw-wall { grid-template-columns:1fr; }
    .tw-card--boys { grid-column:auto !important; }
    .tw-meta { left:15px; right:15px; bottom:14px; }
    .tw-type { display:none; }
  }
  @media (prefers-reduced-motion: reduce) {
    .tw-card { opacity:1; transform:none !important; transition:none !important; }
    .tw-lightbox, .tw-lightbox__frame { transition:none !important; }
  }
`;
document.head.appendChild(style);

let thumbnailSection = null;
let thumbnailCards = [];
let motionRaf = 0;
let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function updateScrollMotion() {
  motionRaf = 0;
  if (!thumbnailSection || reducedMotion || window.innerWidth < 621) return;

  const rect = thumbnailSection.getBoundingClientRect();
  const viewport = window.innerHeight;
  const travel = rect.height + viewport;
  const progress = clamp((viewport - rect.top) / travel, 0, 1);
  const phase = progress * 2 - 1;

  thumbnailCards.forEach(({ element, work, index }) => {
    const x = Math.round(phase * work.motion.x);
    const y = Math.round(phase * -work.motion.y);
    const localWave = Math.sin((progress * Math.PI * 1.35) + index * 0.8);
    const drift = Math.round(localWave * work.motion.drift);
    const rotate = (phase * work.rotate * 0.42).toFixed(2);

    element.style.setProperty('--tw-x', `${x + drift}px`);
    element.style.setProperty('--tw-y', `${y}px`);
    element.style.setProperty('--tw-scroll-rotate', `${rotate}deg`);
  });
}

function requestMotionUpdate() {
  if (motionRaf) return;
  motionRaf = window.requestAnimationFrame(updateScrollMotion);
}

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

  thumbnailWorks.forEach((work, index) => {
    const article = document.createElement('article');
    article.className = work.className;
    article.style.setProperty('--tw-rotate', `${work.rotate}deg`);
    article.setAttribute('role', 'listitem');
    article.setAttribute('tabindex', '0');
    article.setAttribute('aria-label', `${work.title}, ${work.category}. Open thumbnail.`);
    article.innerHTML = `
      <img src="${work.image}" alt="${work.title} thumbnail design" loading="lazy" decoding="async" draggable="false" />
      <div class="tw-meta">
        <div>
          <div class="tw-index">${String(index + 1).padStart(2, '0')} / ${String(thumbnailWorks.length).padStart(2, '0')}</div>
          <div class="tw-name">${work.title}</div>
        </div>
        <div class="tw-type">${work.category}</div>
      </div>
    `;

    const open = () => openLightbox(work);
    article.addEventListener('click', open);
    article.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });

    wall.appendChild(article);
    thumbnailCards.push({ element: article, work, index });
  });

  clientsSection.parentNode.insertBefore(section, clientsSection);
  thumbnailSection = section;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      thumbnailCards.forEach(({ element }, index) => {
        window.setTimeout(() => element.classList.add('is-visible'), index * 90);
      });
      observer.disconnect();
      requestMotionUpdate();
    });
  }, { threshold: 0.12 });
  revealObserver.observe(section);

  window.addEventListener('scroll', requestMotionUpdate, { passive: true });
  window.addEventListener('resize', requestMotionUpdate, { passive: true });
  requestMotionUpdate();

  return true;
}

const lightbox = document.createElement('div');
lightbox.className = 'tw-lightbox';
lightbox.setAttribute('role', 'dialog');
lightbox.setAttribute('aria-modal', 'true');
lightbox.setAttribute('aria-label', 'Thumbnail preview');
lightbox.innerHTML = `
  <div class="tw-lightbox__frame">
    <button class="tw-close" type="button" aria-label="Close thumbnail preview">×</button>
    <img class="tw-lightbox__image" alt="" />
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

if (!buildShowcase()) {
  const observer = new MutationObserver(() => {
    if (buildShowcase()) observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
}
