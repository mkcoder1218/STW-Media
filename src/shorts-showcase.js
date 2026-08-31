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

  const updateFocus = (progress) => {
    const index = Math.min(cards.length - 1, Math.max(0, Math.round(progress * (cards.length - 1))));
    cards.forEach((card, cardIndex) => card.classList.toggle('is-focus', cardIndex === index));
    if (countLabel) countLabel.textContent = `${String(index + 1).padStart(2, '0')} / 03`;
  };

  gsap.set(cards, {
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0,
    rotation: (index) => [-6, 0, 6][index],
    rotationY: (index) => [-8, 0, 8][index],
    scale: (index) => [0.92, 1, 0.92][index],
    opacity: (index) => [0.68, 1, 0.68][index],
    filter: (index) => index === 1 ? 'brightness(1)' : 'brightness(.72)',
    zIndex: (index) => [10, 30, 20][index],
  });

  gsap.set(cards[0], { x: -34, y: 22 });
  gsap.set(cards[2], { x: 34, y: 22 });
  if (progressFill) gsap.set(progressFill, { scaleX: 0 });
  cards[1].classList.add('is-focus');

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
    .to(cards[0], { x: -360, y: 22, rotation: -12, rotationY: -16, scale: 0.86, opacity: 0.72, filter: 'brightness(.78)', duration: 1 }, 0)
    .to(cards[1], { x: 0, y: -18, rotation: 0, rotationY: 0, scale: 1.035, opacity: 1, filter: 'brightness(1)', duration: 1 }, 0)
    .to(cards[2], { x: 360, y: 22, rotation: 12, rotationY: 16, scale: 0.86, opacity: 0.72, filter: 'brightness(.78)', duration: 1 }, 0)
    .to(cards[0], { x: -430, y: -18, rotation: -7, rotationY: -8, scale: 0.88, opacity: 0.78, duration: 1 }, 1)
    .to(cards[1], { x: -118, y: 20, rotation: -4, rotationY: -5, scale: 0.92, opacity: 0.8, filter: 'brightness(.82)', duration: 1 }, 1)
    .to(cards[2], { x: 190, y: -26, rotation: 4, rotationY: 4, scale: 1.04, opacity: 1, filter: 'brightness(1)', duration: 1 }, 1)
    .to(cards[0], { x: -300, y: 24, rotation: -8, rotationY: -8, scale: 0.87, opacity: 0.74, duration: 1 }, 2)
    .to(cards[1], { x: 0, y: -30, rotation: 0, rotationY: 0, scale: 0.94, opacity: 0.86, filter: 'brightness(.88)', duration: 1 }, 2)
    .to(cards[2], { x: 300, y: 16, rotation: 8, rotationY: 8, scale: 1, opacity: 1, filter: 'brightness(1)', duration: 1 }, 2);

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

const shortsObserver = new MutationObserver(() => {
  const section = document.getElementById(SHORTS_SECTION_ID);
  if (section && section.dataset.shortsReady !== 'true') enhanceShorts();
});

shortsObserver.observe(document.getElementById('root') || document.documentElement, {
  childList: true,
  subtree: true,
});
