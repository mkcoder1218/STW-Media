const HERO_SELECTOR = '#root main section';

const heroStyle = document.createElement('style');
heroStyle.textContent = `
  .stw-gsap-hero .stw-hero-line {
    display: block;
    will-change: transform, opacity, filter;
  }

  .stw-gsap-hero .stw-hero-highlight {
    display: inline-block;
    position: relative;
  }

  .stw-gsap-hero .stw-hero-highlight::after {
    content: '';
    position: absolute;
    left: 2%;
    right: 2%;
    bottom: -8px;
    height: 16px;
    border-radius: 999px;
    background: rgba(0, 153, 255, .24);
    filter: blur(18px);
    opacity: .72;
    pointer-events: none;
  }

  .stw-hero-visual-stage {
    position: relative;
    transform-style: preserve-3d;
    perspective: 1100px;
  }

  .stw-hero-visual-card {
    position: relative;
    z-index: 2;
    transform-style: preserve-3d;
    will-change: transform, opacity, clip-path;
  }

  .stw-hero-visual-stage::before {
    content: '';
    position: absolute;
    inset: 8% -9% -7% -9%;
    border-radius: 42%;
    background: radial-gradient(circle at center, rgba(0,153,255,.24), rgba(0,153,255,.07) 42%, transparent 72%);
    filter: blur(34px);
    opacity: .78;
    pointer-events: none;
    z-index: 0;
  }

  .stw-hero-visual-stage::after {
    content: '';
    position: absolute;
    inset: -8%;
    background-image:
      linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
    background-size: 36px 36px;
    mask-image: radial-gradient(circle at center, black 28%, transparent 74%);
    opacity: .38;
    pointer-events: none;
    z-index: 0;
  }

  .stw-hero-chip {
    position: absolute;
    z-index: 5;
    display: flex;
    align-items: center;
    gap: 9px;
    min-width: 138px;
    padding: 11px 14px;
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 14px;
    background: rgba(9, 12, 14, .72);
    box-shadow: 0 18px 44px rgba(0,0,0,.38);
    backdrop-filter: blur(14px);
    color: white;
    pointer-events: none;
    will-change: transform, opacity;
  }

  .stw-hero-chip::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex: 0 0 auto;
    background: #0099ff;
    box-shadow: 0 0 14px rgba(0,153,255,.85);
  }

  .stw-hero-chip strong {
    display: block;
    font-size: 13px;
    line-height: 1.1;
    letter-spacing: -.01em;
  }

  .stw-hero-chip span {
    display: block;
    margin-top: 3px;
    color: rgba(255,255,255,.5);
    font-size: 8px;
    line-height: 1;
    font-weight: 800;
    letter-spacing: .14em;
    text-transform: uppercase;
  }

  .stw-hero-chip--growth { left: -14%; top: 13%; }
  .stw-hero-chip--views { right: -11%; top: 44%; }
  .stw-hero-chip--ctr { left: 1%; bottom: -6%; }

  @media (max-width: 1023px) {
    .stw-hero-chip { display: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    .stw-gsap-hero .stw-hero-line,
    .stw-hero-visual-card,
    .stw-hero-chip { transform: none !important; opacity: 1 !important; filter: none !important; }
  }
`;
document.head.appendChild(heroStyle);

const aboutStyle = document.createElement('style');
aboutStyle.textContent = `
  #about-section .stw-camera-stage {
    position: relative;
    isolation: isolate;
    overflow: hidden;
  }

  #about-section .stw-camera-stage img {
    will-change: transform, filter, opacity;
    transform-origin: center center;
  }

  .stw-camera-flash {
    position: absolute;
    inset: 0;
    z-index: 12;
    background: rgba(255,255,255,.98);
    opacity: 0;
    pointer-events: none;
    mix-blend-mode: screen;
  }

  .stw-camera-vignette {
    position: absolute;
    inset: 0;
    z-index: 8;
    pointer-events: none;
    opacity: 0;
    background: radial-gradient(circle at center, transparent 35%, rgba(0,0,0,.6) 100%);
  }

  .stw-camera-focus {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 10;
    width: 56%;
    aspect-ratio: 1.35;
    transform: translate(-50%, -50%) scale(1.16);
    opacity: 0;
    pointer-events: none;
  }

  .stw-camera-focus span {
    position: absolute;
    width: 34px;
    height: 34px;
    border-color: rgba(255,255,255,.9);
    filter: drop-shadow(0 0 9px rgba(0,153,255,.25));
  }

  .stw-camera-focus span:nth-child(1) {
    left: 0;
    top: 0;
    border-left: 2px solid;
    border-top: 2px solid;
  }

  .stw-camera-focus span:nth-child(2) {
    right: 0;
    top: 0;
    border-right: 2px solid;
    border-top: 2px solid;
  }

  .stw-camera-focus span:nth-child(3) {
    left: 0;
    bottom: 0;
    border-left: 2px solid;
    border-bottom: 2px solid;
  }

  .stw-camera-focus span:nth-child(4) {
    right: 0;
    bottom: 0;
    border-right: 2px solid;
    border-bottom: 2px solid;
  }

  .stw-camera-focus::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    background: #0099ff;
    box-shadow: 0 0 16px rgba(0,153,255,.8);
  }

  #about-section .stw-camera-stat {
    transform-origin: 18% 50%;
    will-change: transform, opacity, filter;
  }

  #about-section .stw-camera-stat::after {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    border: 1px solid rgba(0,153,255,0);
    pointer-events: none;
    transition: border-color .35s ease, box-shadow .35s ease;
  }

  #about-section .stw-camera-stat.is-captured::after {
    border-color: rgba(0,153,255,.26);
    box-shadow: inset 0 0 24px rgba(0,153,255,.04), 0 0 26px rgba(0,153,255,.05);
  }

  @media (prefers-reduced-motion: reduce) {
    .stw-camera-focus,
    .stw-camera-flash,
    .stw-camera-vignette { display: none !important; }
    #about-section .stw-camera-stage img,
    #about-section .stw-camera-stat {
      transform: none !important;
      opacity: 1 !important;
      filter: none !important;
    }
  }
`;
document.head.appendChild(aboutStyle);

function createChip(className, value, label) {
  const chip = document.createElement('div');
  chip.className = `stw-hero-chip ${className}`;
  chip.innerHTML = `<div><strong>${value}</strong><span>${label}</span></div>`;
  return chip;
}

function enhanceHero() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return false;

  const hero = document.querySelector(HERO_SELECTOR);
  if (!hero || hero.dataset.gsapHeroReady === 'true') return !!hero;

  const heading = hero.querySelector('h1');
  const copy = heading?.parentElement?.querySelector('p');
  const buttonWrap = heading?.parentElement?.querySelector('div.flex');
  const visualImage = hero.querySelector('img[alt*="YouTube analytics"]');
  const visualCard = visualImage?.parentElement;
  const visualStage = visualCard?.parentElement;

  if (!heading || !copy || !buttonWrap || !visualCard || !visualStage) return false;

  hero.dataset.gsapHeroReady = 'true';
  hero.classList.add('stw-gsap-hero');
  visualStage.classList.add('stw-hero-visual-stage');
  visualCard.classList.add('stw-hero-visual-card');

  heading.innerHTML = `
    <span class="stw-hero-line stw-hero-line-1">We turn YouTube</span>
    <span class="stw-hero-line stw-hero-line-2">channels into</span>
    <span class="stw-hero-line stw-hero-line-3"><span class="stw-hero-highlight text-vibrant-blue relative z-10">growth engines.</span></span>
  `;

  const chips = [
    createChip('stw-hero-chip--growth', '+240%', 'subscriber growth'),
    createChip('stw-hero-chip--views', '15M', 'monthly views'),
    createChip('stw-hero-chip--ctr', '+18%', 'click-through lift'),
  ];
  chips.forEach((chip) => visualStage.appendChild(chip));

  gsap.registerPlugin(ScrollTrigger);

  const lines = hero.querySelectorAll('.stw-hero-line');
  const buttons = buttonWrap.querySelectorAll('button');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reducedMotion) {
    gsap.set(lines, { y: 66, opacity: 0, filter: 'blur(8px)' });
    gsap.set(copy, { y: 26, opacity: 0 });
    gsap.set(buttons, { y: 22, opacity: 0 });
    gsap.set(visualCard, { opacity: 0, clipPath: 'inset(7% 7% 7% 7% round 2rem)' });
    gsap.set(chips, { y: 18, opacity: 0, scale: .92 });

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro
      .to(lines[0], { y: 0, opacity: 1, filter: 'blur(0px)', duration: .72 })
      .to(lines[1], { y: 0, opacity: 1, filter: 'blur(0px)', duration: .72 }, '-=.48')
      .to(lines[2], { y: 0, opacity: 1, filter: 'blur(0px)', duration: .8 }, '-=.46')
      .to(copy, { y: 0, opacity: 1, duration: .58 }, '-=.36')
      .to(buttons, { y: 0, opacity: 1, duration: .5, stagger: .11 }, '-=.3')
      .to(visualCard, { opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 2rem)', duration: .9 }, '-=.88')
      .to(chips, { y: 0, opacity: 1, scale: 1, duration: .55, stagger: .1 }, '-=.45');

    gsap.to(heading.parentElement, {
      y: -68,
      opacity: .55,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });

    gsap.to(visualCard, {
      y: 76,
      x: 28,
      scale: .965,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });

    const chipMoves = [
      { x: -28, y: -42 },
      { x: 36, y: 24 },
      { x: -12, y: 58 },
    ];

    chips.forEach((chip, index) => {
      gsap.to(chip, {
        x: chipMoves[index].x,
        y: chipMoves[index].y,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2 + index * .18,
        },
      });
    });
  }

  if (window.matchMedia('(pointer:fine)').matches && !reducedMotion) {
    const rotateX = gsap.quickTo(visualCard, 'rotateX', { duration: .55, ease: 'power3.out' });
    const rotateY = gsap.quickTo(visualCard, 'rotateY', { duration: .55, ease: 'power3.out' });

    visualStage.addEventListener('pointermove', (event) => {
      const rect = visualStage.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - .5;
      const py = (event.clientY - rect.top) / rect.height - .5;
      rotateY(px * 8);
      rotateX(py * -7);
    });

    visualStage.addEventListener('pointerleave', () => {
      rotateX(0);
      rotateY(0);
    });
  }

  ScrollTrigger.refresh();
  return true;
}

function enhanceAboutCamera() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return false;

  const section = document.getElementById('about-section');
  if (!section || section.dataset.cameraReady === 'true') return !!section;

  const image = section.querySelector('img[alt*="Professional video editing"]');
  if (!image) return false;

  const imageStage = image.parentElement;
  if (!imageStage) return false;

  const statsWrap = section.querySelector('.flex.flex-col.gap-5.mt-4');
  const statCards = statsWrap ? [...statsWrap.children] : [];
  if (!statCards.length) return false;

  section.dataset.cameraReady = 'true';
  imageStage.classList.add('stw-camera-stage');
  statCards.forEach((card) => card.classList.add('stw-camera-stat'));

  const flash = document.createElement('div');
  flash.className = 'stw-camera-flash';

  const vignette = document.createElement('div');
  vignette.className = 'stw-camera-vignette';

  const focus = document.createElement('div');
  focus.className = 'stw-camera-focus';
  focus.setAttribute('aria-hidden', 'true');
  focus.innerHTML = '<span></span><span></span><span></span><span></span>';

  imageStage.appendChild(vignette);
  imageStage.appendChild(focus);
  imageStage.appendChild(flash);

  gsap.registerPlugin(ScrollTrigger);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    statCards.forEach((card) => card.classList.add('is-captured'));
    return true;
  }

  gsap.set(image, {
    scale: 1.075,
    filter: 'blur(11px) brightness(.58) saturate(.82)',
    opacity: .92,
  });
  gsap.set(focus, { opacity: 0, scale: 1.18 });
  gsap.set(vignette, { opacity: .34 });
  gsap.set(statCards, {
    opacity: 0,
    y: 22,
    scale: .955,
    filter: 'blur(5px)',
  });

  const capture = gsap.timeline({
    paused: true,
    defaults: { ease: 'power3.out' },
  });

  capture
    .to(focus, { opacity: .88, scale: 1.07, duration: .28 })
    .to(focus, { scale: .88, duration: .34, ease: 'power2.inOut' })
    .to(image, {
      scale: 1,
      filter: 'blur(0px) brightness(1) saturate(1)',
      opacity: 1,
      duration: .42,
      ease: 'power4.out',
    }, '-=.28')
    .to(vignette, { opacity: 0, duration: .24 }, '-=.22')
    .to(focus, { opacity: 0, duration: .12 }, '-=.06')
    .to(flash, { opacity: .94, duration: .055, ease: 'none' })
    .to(flash, { opacity: 0, duration: .13, ease: 'power2.out' })
    .to(image, { scale: .986, duration: .075, ease: 'power2.in' }, '<')
    .to(image, { scale: 1, duration: .2, ease: 'back.out(2.2)' })
    .to(statCards, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: .36,
      stagger: .16,
      ease: 'back.out(1.7)',
      onStart: () => {
        statCards.forEach((card, index) => {
          window.setTimeout(() => card.classList.add('is-captured'), index * 160 + 130);
        });
      },
    }, '-=.03');

  ScrollTrigger.create({
    trigger: section,
    start: 'top 68%',
    once: true,
    onEnter: () => capture.play(0),
  });

  ScrollTrigger.refresh();
  return true;
}

let attempts = 0;
const tryEnhance = () => {
  attempts += 1;
  const heroReady = enhanceHero();
  const aboutReady = enhanceAboutCamera();
  if ((heroReady && aboutReady) || attempts > 80) return;
  window.setTimeout(tryEnhance, 80);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', tryEnhance, { once: true });
} else {
  tryEnhance();
}

const heroObserver = new MutationObserver(() => {
  const hero = document.querySelector(HERO_SELECTOR);
  if (hero && hero.dataset.gsapHeroReady !== 'true') enhanceHero();

  const about = document.getElementById('about-section');
  if (about && about.dataset.cameraReady !== 'true') enhanceAboutCamera();
});
heroObserver.observe(document.getElementById('root') || document.documentElement, { childList: true, subtree: true });
