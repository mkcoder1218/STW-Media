/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navigation from './components/Navigation';
import HomeView from './components/HomeView';
import ContactView from './components/ContactView';
import { ScreenType } from './types';

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('home');
  const [activeSection, setActiveSection] = useState<string>('');

  const manualScrollRef = React.useRef<boolean>(false);
  const timeoutRef = React.useRef<number | null>(null);

  // Trigger scroll to top upon screen navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [screen]);

  // Listen to scrolling to track active section
  useEffect(() => {
    if (screen !== 'home') {
      setActiveSection('');
      return;
    }

    const sections = ['about-section', 'services-section', 'work-section', 'clients-section'];
    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -45% 0px', // Center-top detection matches scrolled viewport
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
        // Fallback for end of page to highlight "Clients"
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      manualScrollRef.current = true;
      setActiveSection(sectionId);

      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

      // Offset scroll calculation for fixed navbar header
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Reset manual scroll override after transition completes
      timeoutRef.current = window.setTimeout(() => {
        manualScrollRef.current = false;
      }, 1000);
    }
  };

  return (
    <div className="bg-dark-bg text-on-surface font-sans min-h-screen selection:bg-brand-blue selection:text-white">
      
      {/* Navigation Layer */}
      <Navigation 
        currentScreen={screen} 
        setScreen={setScreen} 
        scrollToSection={scrollToSection} 
        activeSection={activeSection}
      />

      {/* Screen Views and Transition Engines */}
      <main className="w-full">
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

    </div>
  );
}
