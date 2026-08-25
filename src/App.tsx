/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Play, ThumbsUp, Volume2, VolumeX, X } from 'lucide-react';
import Navigation from './components/Navigation';
import HomeView from './components/HomeView';
import ContactView from './components/ContactView';
import { ScreenType } from './types';

type WorkHover = {
  article: HTMLElement;
  rect: DOMRect;
  youtubeId: string;
  label: string;
};

type WorkVideoSelection = {
  youtubeId: string;
  label: string;
};

function getWorkData(article: HTMLElement) {
  const iframe = article.querySelector('iframe');
  const image = article.querySelector('img');
  const src = iframe?.src || image?.src || '';
  const match = src.match(/(?:embed\/|\/vi\/)([A-Za-z0-9_-]{6,})/);
  if (!match) return null;

  return {
    youtubeId: match[1],
    label: article.querySelector('h3')?.textContent?.trim() || 'Featured Work',
  };
}

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('home');
  const [activeSection, setActiveSection] = useState<string>('');
  const [hoveredWork, setHoveredWork] = useState<WorkHover | null>(null);
  const [selectedWork, setSelectedWork] = useState<WorkVideoSelection | null>(null);
  const [modalMuted, setModalMuted] = useState(true);

  const manualScrollRef = React.useRef<boolean>(false);
  const timeoutRef = React.useRef<number | null>(null);
  const hoverClearRef = React.useRef<number | null>(null);
  const modalPlayerRef = React.useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [screen]);

  useEffect(() => {
    if (screen !== 'home') {
      setActiveSection('');
      return;
    }

    const sections = ['about-section', 'services-section', 'work-section', 'clients-section'];
    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -45% 0px',
      threshold: 0.1,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      if (manualScrollRef.current) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      if (manualScrollRef.current) return;
      if (window.scrollY < 180) {
        setActiveSection('');
      } else {
        const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
        if (isAtBottom) {
          setActiveSection('clients-section');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [screen]);

  useEffect(() => {
    if (screen !== 'home') {
      setHoveredWork(null);
      return;
    }

    const workSection = document.getElementById('work-section');
    if (!workSection) return;

    const clearHoverTimer = () => {
      if (hoverClearRef.current) {
        window.clearTimeout(hoverClearRef.current);
        hoverClearRef.current = null;
      }
    };

    const updateArticle = (article: HTMLElement) => {
      const data = getWorkData(article);
      if (!data) return;

      clearHoverTimer();
      setHoveredWork({
        article,
        rect: article.getBoundingClientRect(),
        ...data,
      });
    };

    const onMouseOver = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const article = target?.closest('article') as HTMLElement | null;
      if (!article || !workSection.contains(article)) return;
      updateArticle(article);
    };

    const onMouseOut = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const article = target?.closest('article') as HTMLElement | null;
      if (!article || !workSection.contains(article)) return;

      const nextTarget = event.relatedTarget as Node | null;
      if (nextTarget && article.contains(nextTarget)) return;

      clearHoverTimer();
      hoverClearRef.current = window.setTimeout(() => {
        setHoveredWork(null);
      }, 180);
    };

    const updateRect = () => {
      setHoveredWork((current) => {
        if (!current?.article.isConnected) return null;
        return { ...current, rect: current.article.getBoundingClientRect() };
      });
    };

    workSection.addEventListener('mouseover', onMouseOver);
    workSection.addEventListener('mouseout', onMouseOut);
    window.addEventListener('scroll', updateRect, { passive: true });
    window.addEventListener('resize', updateRect);

    return () => {
      workSection.removeEventListener('mouseover', onMouseOver);
      workSection.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('scroll', updateRect);
      window.removeEventListener('resize', updateRect);
      clearHoverTimer();
    };
  }, [screen]);

  useEffect(() => {
    if (!selectedWork) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedWork(null);
        setModalMuted(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedWork]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      manualScrollRef.current = true;
      setActiveSection(sectionId);

      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      timeoutRef.current = window.setTimeout(() => {
        manualScrollRef.current = false;
      }, 1000);
    }
  };

  const openWorkModal = (work: WorkHover) => {
    setSelectedWork({ youtubeId: work.youtubeId, label: work.label });
    setModalMuted(true);
    setHoveredWork(null);
  };

  const closeWorkModal = () => {
    setSelectedWork(null);
    setModalMuted(true);
  };

  const toggleModalMute = () => {
    const nextMuted = !modalMuted;
    modalPlayerRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: 'command',
        func: nextMuted ? 'mute' : 'unMute',
        args: [],
      }),
      '*'
    );
    setModalMuted(nextMuted);
  };

  const keepHoverOpen = () => {
    if (hoverClearRef.current) {
      window.clearTimeout(hoverClearRef.current);
      hoverClearRef.current = null;
    }
  };

  const scheduleHoverClose = () => {
    if (hoverClearRef.current) window.clearTimeout(hoverClearRef.current);
    hoverClearRef.current = window.setTimeout(() => setHoveredWork(null), 180);
  };

  return (
    <div className="bg-dark-bg text-on-surface font-sans min-h-screen overflow-x-hidden selection:bg-brand-blue selection:text-white">
      <Navigation
        currentScreen={screen}
        setScreen={setScreen}
        scrollToSection={scrollToSection}
        activeSection={activeSection}
      />

      <main className="w-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          {screen === 'home' ? (
            <motion.div
              key="home-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <HomeView setScreen={setScreen} scrollToSection={scrollToSection} />
            </motion.div>
          ) : (
            <motion.div
              key="contact-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ContactView setScreen={setScreen} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {hoveredWork && !selectedWork && (
          <motion.div
            key={`${hoveredWork.youtubeId}-hover`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed z-[80] overflow-hidden rounded-[1.4rem] sm:rounded-[2rem] border border-vibrant-blue/35 bg-black/35 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-[2px]"
            style={{
              left: hoveredWork.rect.left,
              top: hoveredWork.rect.top,
              width: hoveredWork.rect.width,
              height: hoveredWork.rect.height,
            }}
            onMouseEnter={keepHoverOpen}
            onMouseLeave={scheduleHoverClose}
          >
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />

            <button
              type="button"
              onClick={() => openWorkModal(hoveredWork)}
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-black shadow-2xl transition-all hover:scale-105 active:scale-95 sm:px-6 sm:py-3.5"
              aria-label={`Play ${hoveredWork.label}`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-vibrant-blue text-white">
                <Play size={16} fill="currentColor" />
              </span>
              Play video
            </button>

            <div className="absolute bottom-4 right-4 flex items-center gap-2 sm:bottom-5 sm:right-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/85 backdrop-blur-md sm:text-xs">
                <ThumbsUp size={14} />
                Like
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/85 backdrop-blur-md sm:text-xs">
                <Bell size={14} />
                Subscribe
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedWork && (
          <motion.div
            key="work-video-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[140] flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl sm:p-8"
            onClick={closeWorkModal}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedWork.label} video`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-white/15 bg-[#080a0b] shadow-[0_35px_120px_rgba(0,0,0,0.8)] sm:rounded-3xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative aspect-video bg-black">
                <iframe
                  ref={modalPlayerRef}
                  key={selectedWork.youtubeId}
                  src={`https://www.youtube.com/embed/${selectedWork.youtubeId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`}
                  title={`${selectedWork.label} — STW Media work`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />

                <div className="absolute right-3 top-3 z-10 flex items-center gap-2 sm:right-4 sm:top-4">
                  <button
                    type="button"
                    onClick={toggleModalMute}
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-black/65 px-4 text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md transition-colors hover:bg-black/85"
                    aria-label={modalMuted ? 'Unmute video' : 'Mute video'}
                  >
                    {modalMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                    <span className="hidden sm:inline">{modalMuted ? 'Unmute' : 'Mute'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={closeWorkModal}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/65 text-white backdrop-blur-md transition-colors hover:bg-black/85"
                    aria-label="Close video"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-vibrant-blue">Selected Work</span>
                  <h3 className="mt-1 font-display text-lg font-extrabold text-white sm:text-xl">{selectedWork.label}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-white/55">
                  <span className="inline-flex items-center gap-1.5"><ThumbsUp size={14} /> Like</span>
                  <span className="text-white/20">•</span>
                  <span className="inline-flex items-center gap-1.5"><Bell size={14} /> Subscribe</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
