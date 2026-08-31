const SHORTS_SECTION_ID = 'shorts-section';

const shortsStyle = document.createElement('style');
shortsStyle.textContent = `
  #${SHORTS_SECTION_ID} .stw-shorts-stage {
    perspective: 1400px;
    transform-style: preserve-3d;
  }

  #${SHORTS_SECTION_ID} .stw-short-card {
    position: absolute;
    left: 50%;
    top: 50%;
    width: min(28vw, 330px);
    aspect-ratio: 9 / 16;
    transform: translate(-50%, -50%);
    transform-origin: 50% 82%;
    will-change: transform, opacity, filter;
  }

  #${SHORTS_SECTION_ID} .stw-short-device {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 2rem;
    border: 1px solid rgba(255, 255, 255, .13);
    background: #050607;
    box-shadow: 0 35px 90px rgba(0, 0, 0, .68), inset 0 0 0 1px rgba(255, 255, 255, .025);
    transform-style: preserve-3d;
    will-change: transform, box-shadow;
  }

  #${SHORTS_SECTION_ID} .stw-short-device::before {
    content: '';
    position: absolute;
    z-index: 5;
    left: 50%;
    top: 10px;
    width: 28%;
    height: 5px;
    border-radius: 999px;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, .2);
    pointer-events: none;
  }

  #${SHORTS_SECTION_ID} .stw-short-card iframe {
    transform: scale(1.018);
  }

  #${SHORTS_SECTION_ID} .stw-shorts-progress-fill {
    transform-origin: left center;
    will-change: transform;
  }

  #${SHORTS_SECTION_ID} .stw-short-card.is-focus .stw-short-device {
    border-color: rgba(0, 153, 255, .42);
    box-shadow: 0 38px 110px rgba(0, 0, 0, .72), 0 0 44px rgba(0, 153, 255, .12);
  }

  @media (max-width: 900px) {
    #${SHORTS_SECTION_ID} .stw-short-card {
      width: min(58vw, 300px);
    }
  }

  @media (max-width: 640px) {
    #${SHORTS_SECTION_ID} .stw-short-card {
      width: min(70vw, 280px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    #${SHORTS_SECTION_ID} .stw-short-card {
      position: relative !important;
      left: auto !important;
      top: auto !important;
      display: inline-block;
      width: min(76vw, 280px);
      margin: 0 8px;
      transform: none !important;
      opacity: 1 !important;
      filter: none !important;
    }

    #${SHORTS_SECTION_ID} .stw-shorts-stage {
      height: auto !important;
      overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;
      padding: 16px 0 28px;
    }
  }
`;
document.head.appendChild(shortsStyle);

function enhanceShorts() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return false;

  const section = document.getElementById(SHORTS_SECTION_ID);
  if (!section || section.dataset.shortsReady === 'true') return !!section;

  const stage = section.querySelector('[data-shorts-stage]');
  const cards = [...section.querySelectorAll('[data-short-card]')];
  const progressFill = section.querySelector('[data-shorts-progress]');
  const countLabel = section.querySelector('[data-shorts-count]');

  if (!stage || cards.length !== 3) return false;

  section.dataset.shortsReady = 'true';
  gsap.registerPlugin(ScrollTrigger);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    section.style.height = 'auto';
    cards.forEach((card) => card.classList.add('is-focus'));
    return true;
  }

  const spread = Math.min(360, Math.max(150, window.innerWidth * 0.29));
  const sideShift = Math.min(250, Math.max(105, window.innerWidth * 0.2));
  const stackOffset = Math.min(52, Math.max(24, window.innerWidth * 0.035));
  let focusedIndex = -1;

  const updateFocus = (progress) => {
    const index = Math.min(cards.length - 1, Math.max(0, Math.round(progress * (cards.length - 1))));
    if (index === focusedIndex) return;

    focusedIndex = index;
    cards.forEach((card, cardIndex) => card.classList.toggle('is-focus', cardIndex === index));

    const count = `${String(index + 1).padStart(2, '0')} / 03`;
    if (countLabel && countLabel.textContent !== count) countLabel.textContent = count;
  };

  gsap.set(cards, {
    xPercent: -50,
    yPercent: -50,
    x: (index) => index * stackOffset,
    y: (index) => -18 + index * 18,
    rotation: (index) => index * 4,
    rotationY: (index) => index * 4,
    scale: (index) => 1 - index * 0.055,
    opacity: (index) => 1 - index * 0.18,
    filter: (index) => index === 0 ? 'brightness(1)' : 'brightness(.74)',
    zIndex: (index) => 30 - index * 10,
  });

  if (progressFill) gsap.set(progressFill, { scaleX: 0 });
  updateFocus(0);

  const deck = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.1,
      onUpdate: (self) => updateFocus(self.progress),
    },
  });

  deck
    .to(cards[0], { x: -spread, y: 22, rotation: -12, rotationY: -14, scale: 0.86, opacity: 0.64, filter: 'brightness(.72)', duration: 1 }, 0)
    .to(cards[1], { x: 0, y: -18, rotation: 0, rotationY: 0, scale: 1, opacity: 1, filter: 'brightness(1)', duration: 1 }, 0)
    .to(cards[2], { x: sideShift, y: 20, rotation: 8, rotationY: 10, scale: 0.9, opacity: 0.66, filter: 'brightness(.72)', duration: 1 }, 0)
    .to(cards[0], { x: -spread * 1.08, y: 30, rotation: -10, rotationY: -10, scale: 0.82, opacity: 0.42, duration: 1 }, 1)
    .to(cards[1], { x: -sideShift, y: 18, rotation: -8, rotationY: -8, scale: 0.88, opacity: 0.7, filter: 'brightness(.78)', duration: 1 }, 1)
    .to(cards[2], { x: 0, y: -18, rotation: 0, rotationY: 0, scale: 1, opacity: 1, filter: 'brightness(1)', duration: 1 }, 1)
    .to(cards[0], { x: -spread, y: 34, rotation: -8, rotationY: -8, scale: 0.8, opacity: 0.34, duration: 1 }, 2)
    .to(cards[1], { x: -spread * 0.62, y: 24, rotation: -7, rotationY: -7, scale: 0.84, opacity: 0.52, filter: 'brightness(.7)', duration: 1 }, 2)
    .to(cards[2], { x: 0, y: -24, rotation: 0, rotationY: 0, scale: 1.035, opacity: 1, filter: 'brightness(1)', duration: 1 }, 2);

  if (progressFill) {
    gsap.to(progressFill, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.1,
      },
    });
  }

  const finePointer = window.matchMedia('(pointer:fine)').matches;
  if (finePointer) {
    cards.forEach((card) => {
      const device = card.querySelector('.stw-short-device');
      if (!device) return;

      const rotateX = gsap.quickTo(device, 'rotateX', { duration: .45, ease: 'power3.out' });
      const rotateY = gsap.quickTo(device, 'rotateY', { duration: .45, ease: 'power3.out' });
      const lift = gsap.quickTo(device, 'y', { duration: .35, ease: 'power3.out' });

      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - .5;
        const py = (event.clientY - rect.top) / rect.height - .5;
        rotateY(px * 9);
        rotateX(py * -8);
        lift(-8);
      });

      card.addEventListener('pointerleave', () => {
        rotateX(0);
        rotateY(0);
        lift(0);
      });
    });
  }

  ScrollTrigger.refresh();
  return true;
}

let attempts = 0;
const tryEnhanceShorts = () => {
  attempts += 1;
  if (enhanceShorts() || attempts > 80) return;
  window.setTimeout(tryEnhanceShorts, 80);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', tryEnhanceShorts, { once: true });
} else {
  tryEnhanceShorts();
}
