const thumbnailWorks = [
  {
    title: 'Dark Side of Money',
    category: 'Finance / Curiosity Hook',
    image: '/thumbnail-work/dark-side-money.jpg',
    className: 'tw-card tw-card--dark',
    rotate: '-2.5deg',
  },
  {
    title: 'Girls Needs',
    category: 'Lifestyle / Comparison',
    image: '/thumbnail-work/girls-needs.jpg',
    className: 'tw-card tw-card--girls',
    rotate: '1.8deg',
  },
  {
    title: 'Boys Needs',
    category: 'Lifestyle / Comparison',
    image: '/thumbnail-work/boys-needs.jpg',
    className: 'tw-card tw-card--boys',
    rotate: '-1.4deg',
  },
  {
    title: 'Claude in Asia',
    category: 'Tech / Explainer',
    image: '/thumbnail-work/claude-asia.jpg',
    className: 'tw-card tw-card--claude',
    rotate: '2.2deg',
  },
  {
    title: "Why You Can't Fall Asleep",
    category: 'Educational / Human Hook',
    image: '/thumbnail-work/fall-asleep.jpg',
    className: 'tw-card tw-card--sleep',
    rotate: '-1.7deg',
  },
];

const style = document.createElement('style');
style.textContent = `
  #thumbnail-work-section {
    position: relative;
    overflow: clip;
    padding: clamp(82px, 9vw, 150px) 24px clamp(100px, 11vw, 180px);
    background:
      radial-gradient(circle at 12% 24%, rgba(0, 153, 255, .12), transparent 25%),
      radial-gradient(circle at 88% 72%, rgba(0, 153, 255, .08), transparent 28%),
      #0b0d0e;
    border-top: 1px solid rgba(255,255,255,.06);
    border-bottom: 1px solid rgba(255,255,255,.06);
  }
  .tw-shell { max-width: 1280px; margin: 0 auto; }
  .tw-header { display: grid; grid-template-columns: minmax(0,1.2fr) minmax(260px,.8fr); gap: 42px; align-items: end; margin-bottom: clamp(52px, 7vw, 96px); }
  .tw-kicker { display:block; color:#0099ff; font-size:12px; font-weight:800; letter-spacing:.27em; text-transform:uppercase; margin-bottom:14px; }
  .tw-title { margin:0; color:white; font-family:inherit; font-size:clamp(42px,6vw,78px); line-height:.94; letter-spacing:-.045em; font-weight:900; max-width:760px; }
  .tw-copy { margin:0; color:rgba(235,239,242,.62); font-size:clamp(15px,1.45vw,18px); line-height:1.65; max-width:480px; justify-self:end; }
  .tw-wall { position:relative; display:grid; grid-template-columns:repeat(12,minmax(0,1fr)); grid-auto-rows:44px; gap:18px; min-height:1040px; }
  .tw-card { position:relative; overflow:hidden; border-radius:22px; border:1px solid rgba(255,255,255,.12); background:#111; box-shadow:0 28px 70px rgba(0,0,0,.42); cursor:zoom-in; transform:translateY(54px) rotate(var(--tw-rotate)) scale(.96); opacity:0; transition:opacity .7s ease, transform .85s cubic-bezier(.22,1,.36,1), border-color .35s ease, filter .35s ease, box-shadow .35s ease; isolation:isolate; }
  .tw-card.is-visible { opacity:1; transform:translateY(0) rotate(var(--tw-rotate)) scale(1); }
  .tw-card img { width:100%; height:100%; object-fit:cover; display:block; transform:scale(1.01); transition:transform .65s cubic-bezier(.22,1,.36,1), filter .35s ease; }
  .tw-card::after { content:''; position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,.76), rgba(0,0,0,.04) 48%, transparent 70%); opacity:.68; transition:opacity .35s ease; pointer-events:none; }
  .tw-card:hover { z-index:10; border-color:rgba(0,153,255,.7); transform:translateY(-12px) rotate(0deg) scale(1.025); box-shadow:0 40px 95px rgba(0,0,0,.58),0 0 0 1px rgba(0,153,255,.14); }
  .tw-card:hover img { transform:scale(1.055); }
  .tw-card:hover::after { opacity:.9; }
  .tw-meta { position:absolute; left:22px; right:22px; bottom:20px; z-index:2; display:flex; align-items:end; justify-content:space-between; gap:16px; transform:translateY(8px); opacity:.78; transition:transform .35s ease, opacity .35s ease; pointer-events:none; }
  .tw-card:hover .tw-meta { transform:translateY(0); opacity:1; }
  .tw-index { color:#0099ff; font-size:11px; font-weight:900; letter-spacing:.22em; text-transform:uppercase; }
  .tw-name { color:white; font-size:clamp(17px,2vw,25px); font-weight:850; letter-spacing:-.02em; margin-top:4px; }
  .tw-type { color:rgba(255,255,255,.68); font-size:11px; font-weight:750; letter-spacing:.12em; text-transform:uppercase; text-align:right; max-width:165px; }
  .tw-card--dark { grid-column:1 / span 5; grid-row:1 / span 8; }
  .tw-card--girls { grid-column:7 / span 6; grid-row:2 / span 9; }
  .tw-card--boys { grid-column:3 / span 7; grid-row:10 / span 9; }
  .tw-card--claude { grid-column:1 / span 4; grid-row:19 / span 6; }
  .tw-card--sleep { grid-column:7 / span 6; grid-row:20 / span 7; }
  .tw-footnote { display:flex; align-items:center; gap:10px; margin-top:34px; color:rgba(255,255,255,.35); text-transform:uppercase; letter-spacing:.18em; font-size:10px; font-weight:800; }
  .tw-dot { width:6px; height:6px; border-radius:50%; background:#0099ff; box-shadow:0 0 14px rgba(0,153,255,.75); }

  .tw-lightbox { position:fixed; inset:0; z-index:180; display:flex; align-items:center; justify-content:center; padding:28px; background:rgba(0,0,0,.9); backdrop-filter:blur(18px); opacity:0; pointer-events:none; transition:opacity .22s ease; }
  .tw-lightbox.is-open { opacity:1; pointer-events:auto; }
  .tw-lightbox__frame { position:relative; width:min(1160px,94vw); transform:scale(.95) translateY(12px); transition:transform .3s cubic-bezier(.22,1,.36,1); }
  .tw-lightbox.is-open .tw-lightbox__frame { transform:scale(1) translateY(0); }
  .tw-lightbox__image { display:block; width:100%; max-height:82vh; object-fit:contain; border-radius:22px; border:1px solid rgba(255,255,255,.15); box-shadow:0 40px 120px rgba(0,0,0,.75); background:#080909; }
  .tw-lightbox__bar { margin-top:14px; display:flex; align-items:center; justify-content:space-between; gap:16px; color:white; }
  .tw-lightbox__title { font-size:18px; font-weight:850; }
  .tw-lightbox__type { color:rgba(255,255,255,.5); font-size:11px; letter-spacing:.14em; text-transform:uppercase; font-weight:800; }
  .tw-close { position:absolute; top:-54px; right:0; width:42px; height:42px; border-radius:999px; border:1px solid rgba(255,255,255,.16); background:rgba(15,15,15,.75); color:white; font-size:23px; line-height:1; cursor:pointer; backdrop-filter:blur(10px); }

  @media (max-width: 900px) {
    #thumbnail-work-section { padding-left:18px; padding-right:18px; }
    .tw-header { grid-template-columns:1fr; gap:20px; }
    .tw-copy { justify-self:start; }
    .tw-wall { grid-template-columns:repeat(2,minmax(0,1fr)); grid-auto-rows:auto; min-height:0; gap:14px; }
    .tw-card { grid-column:auto !important; grid-row:auto !important; aspect-ratio:16/9; border-radius:17px; }
    .tw-card--boys { grid-column:1 / -1 !important; }
  }
  @media (max-width: 620px) {
    .tw-wall { grid-template-columns:1fr; }
    .tw-card--boys { grid-column:auto !important; }
    .tw-meta { left:15px; right:15px; bottom:14px; }
    .tw-type { display:none; }
  }
  @media (prefers-reduced-motion: reduce) {
    .tw-card, .tw-card img, .tw-lightbox, .tw-lightbox__frame { transition:none !important; }
    .tw-card { opacity:1; transform:none; }
  }
`;
document.head.appendChild(style);

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
      <div class="tw-footnote"><span class="tw-dot"></span> Creative direction · thumbnail design · visual hooks</div>
    </div>
  `;

  const wall = section.querySelector('.tw-wall');
  thumbnailWorks.forEach((work, index) => {
    const article = document.createElement('article');
    article.className = work.className;
    article.style.setProperty('--tw-rotate', work.rotate);
    article.setAttribute('role', 'listitem');
    article.setAttribute('tabindex', '0');
    article.setAttribute('aria-label', `${work.title}, ${work.category}. Open thumbnail.`);
    article.innerHTML = `
      <img src="${work.image}" alt="${work.title} thumbnail design" loading="lazy" decoding="async" />
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
  });

  clientsSection.parentNode.insertBefore(section, clientsSection);

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const cards = [...section.querySelectorAll('.tw-card')];
      cards.forEach((card, index) => {
        window.setTimeout(() => card.classList.add('is-visible'), index * 105);
      });
      observer.disconnect();
    });
  }, { threshold: 0.16 });
  revealObserver.observe(section);

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
  lightbox.querySelector('.tw-lightbox__image').src = work.image;
  lightbox.querySelector('.tw-lightbox__image').alt = `${work.title} thumbnail design`;
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
