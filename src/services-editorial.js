const serviceStyle = document.createElement('style');
serviceStyle.textContent = `
  #services-section.stw-services-editorial {
    position: relative;
    overflow: clip;
  }

  #services-section .stw-service-grid {
    display: grid !important;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 24px;
    align-items: start;
    perspective: 1400px;
  }

  #services-section .stw-service-card {
    margin: 0 !important;
    transform-style: preserve-3d;
    will-change: transform, opacity;
  }

  #services-section .stw-service-card:nth-child(1) {
    grid-column: 1 / span 5;
    min-height: 470px;
  }

  #services-section .stw-service-card:nth-child(2) {
    grid-column: 7 / span 6;
    min-height: 540px;
    margin-top: 72px !important;
  }

  #services-section .stw-service-card:nth-child(3) {
    grid-column: 3 / span 7;
    min-height: 420px;
    margin-top: -24px !important;
  }

  #services-section .stw-service-card__inner {
    min-height: inherit;
    height: 100%;
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    justify-content: space-between !important;
    gap: 28px !important;
    padding: clamp(30px, 3.4vw, 54px) !important;
    transform-style: preserve-3d;
    transform-origin: center center;
    transition: background-color .35s ease, box-shadow .35s ease;
    overflow: hidden;
  }

  #services-section .stw-service-card__inner > .flex {
    width: 100% !important;
    align-items: flex-start !important;
    gap: 18px !important;
    flex-direction: column !important;
  }

  #services-section .stw-service-card__inner > .flex > span {
    font-size: clamp(3.6rem, 6vw, 6.8rem) !important;
    line-height: .82 !important;
    letter-spacing: -.07em !important;
    opacity: .92;
  }

  #services-section .stw-service-card__inner h3 {
    max-width: 90%;
    font-size: clamp(2rem, 3vw, 3.3rem) !important;
    line-height: .98 !important;
    letter-spacing: -.045em !important;
  }

  #services-section .stw-service-card__inner > p {
    max-width: 88% !important;
    font-size: 15px !important;
    line-height: 1.7 !important;
    margin-top: auto;
  }

  #services-section .stw-service-card__inner > div:last-child:not(.stw-service-motif) {
    position: absolute;
    right: 28px;
    bottom: 28px;
    z-index: 4;
    background: rgba(0,0,0,.22);
    backdrop-filter: blur(10px);
  }

  .stw-service-motif {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    opacity: .75;
  }

  .stw-service-motif::before,
  .stw-service-motif::after {
    content: '';
    position: absolute;
    pointer-events: none;
  }

  .stw-service-card:nth-child(1) .stw-service-motif::before {
    width: 240px;
    height: 240px;
    border: 1px solid rgba(0,153,255,.16);
    border-radius: 50%;
    right: -82px;
    top: -72px;
    box-shadow: 0 0 0 34px rgba(0,153,255,.025), 0 0 0 68px rgba(0,153,255,.018);
  }

  .stw-service-card:nth-child(1) .stw-service-motif::after {
    width: 1px;
    height: 54%;
    right: 88px;
    top: 8%;
    background: linear-gradient(to bottom, transparent, rgba(0,153,255,.42), transparent);
  }

  .stw-service-card:nth-child(2) .stw-service-motif::before {
    width: 58%;
    height: 58%;
    right: -4%;
    top: 5%;
    background-image: linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: linear-gradient(to bottom left, #000, transparent 74%);
  }

  .stw-service-card:nth-child(2) .stw-service-motif::after {
    width: 130px;
    height: 2px;
    right: 12%;
    top: 26%;
    background: linear-gradient(90deg, transparent, #0099ff);
    box-shadow: 0 0 18px rgba(0,153,255,.35);
  }

  .stw-service-card:nth-child(3) .stw-service-motif::before {
    width: 330px;
    height: 330px;
    right: -90px;
    bottom: -170px;
    border: 1px solid rgba(255,255,255,.07);
    transform: rotate(45deg);
    box-shadow: 0 0 0 44px rgba(255,255,255,.012), 0 0 0 88px rgba(0,153,255,.012);
  }

  .stw-service-card:nth-child(3) .stw-service-motif::after {
    left: 8%;
    bottom: 22%;
    width: 34%;
    height: 1px;
    background: linear-gradient(90deg, #0099ff, transparent);
  }

  #services-section .stw-service-card:hover .stw-service-card__inner {
    box-shadow: inset 0 0 0 1px rgba(0,153,255,.12), 0 28px 70px rgba(0,0,0,.32);
  }

  #services-section .stw-service-card:hover .stw-service-motif {
    opacity: 1;
  }

  @media (max-width: 1023px) {
    #services-section .stw-service-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
    }
    #services-section .stw-service-card:nth-child(1),
    #services-section .stw-service-card:nth-child(2),
    #services-section .stw-service-card:nth-child(3) {
      grid-column: auto;
      min-height: 420px;
      margin-top: 0 !important;
    }
    #services-section .stw-service-card:nth-child(3) {
      grid-column: 1 / -1;
      min-height: 360px;
    }
  }

  @media (max-width: 680px) {
    #services-section .stw-service-grid {
      grid-template-columns: 1fr;
    }
    #services-section .stw-service-card:nth-child(1),
    #services-section .stw-service-card:nth-child(2),
    #services-section .stw-service-card:nth-child(3) {
      grid-column: auto;
      min-height: 350px;
    }
    #services-section .stw-service-card__inner h3,
    #services-section .stw-service-card__inner > p {
      max-width: 100% !important;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    #services-section .stw-service-card,
    #services-section .stw-service-card__inner {
      transform: none !important;
      opacity: 1 !important;
    }
  }
`;
document.head.appendChild(serviceStyle);

function enhanceServices() {
  const section = document.getElementById('services-section');
  if (!section || section.dataset.editorialReady === 'true') return !!section;

  const directDivs = [...section.children].filter((el) => el instanceof HTMLElement);
  const grid = directDivs.find((el) => el.children.length === 3 && [...el.children].every((child) => child instanceof HTMLElement));
  if (!grid) return false;

  const cards = [...grid.children];
  if (cards.length !== 3) return false;

  section.dataset.editorialReady = 'true';
  section.classList.add('stw-services-editorial');
  grid.classList.remove('space-y-6');
  grid.classList.add('stw-service-grid');

  cards.forEach((card) => {
    card.classList.add('stw-service-card');
    const inner = [...card.children].find((child) => child.classList?.contains('relative')) || card.lastElementChild;
    if (inner) {
      inner.classList.add('stw-service-card__inner');
      const motif = document.createElement('div');
      motif.className = 'stw-service-motif';
      motif.setAttribute('aria-hidden', 'true');
      inner.appendChild(motif);
    }
  });

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (gsap && ScrollTrigger && !reducedMotion) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.set(cards, { opacity: 0, y: 72, rotateZ: (index) => [-2.4, 2.1, -1.2][index] });
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      rotateZ: 0,
      duration: .9,
      stagger: .16,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 72%',
        once: true,
      },
    });

    if (window.matchMedia('(pointer:fine)').matches) {
      cards.forEach((card) => {
        const inner = card.querySelector('.stw-service-card__inner');
        if (!inner) return;
        const rx = gsap.quickTo(inner, 'rotateX', { duration: .45, ease: 'power3.out' });
        const ry = gsap.quickTo(inner, 'rotateY', { duration: .45, ease: 'power3.out' });
        const tz = gsap.quickTo(inner, 'z', { duration: .45, ease: 'power3.out' });

        card.addEventListener('pointermove', (event) => {
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - .5;
          const py = (event.clientY - rect.top) / rect.height - .5;
          ry(px * 5.5);
          rx(py * -4.5);
          tz(10);
        });

        card.addEventListener('pointerleave', () => {
          rx(0);
          ry(0);
          tz(0);
        });
      });
    }

    ScrollTrigger.refresh();
  }

  return true;
}

let serviceAttempts = 0;
function tryEnhanceServices() {
  serviceAttempts += 1;
  if (enhanceServices() || serviceAttempts > 100) return;
  window.setTimeout(tryEnhanceServices, 80);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', tryEnhanceServices, { once: true });
} else {
  tryEnhanceServices();
}

const serviceObserver = new MutationObserver(() => {
  const section = document.getElementById('services-section');
  if (section && section.dataset.editorialReady !== 'true') enhanceServices();
});
serviceObserver.observe(document.getElementById('root') || document.documentElement, { childList: true, subtree: true });
