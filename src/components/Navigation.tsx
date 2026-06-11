/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ScreenType } from '../types';
import logoUrl from '../../assets/stw-media-logo.png';

interface NavigationProps {
  currentScreen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  scrollToSection: (sectionId: string) => void;
  activeSection: string;
}

export default function Navigation({ currentScreen, setScreen, scrollToSection, activeSection }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'About', sectionId: 'about-section' },
    { name: 'Services', sectionId: 'services-section' },
    { name: 'Work', sectionId: 'work-section' },
    { name: 'Clients', sectionId: 'clients-section' },
  ];

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (currentScreen !== 'home') {
      setScreen('home');
      // Wait for re-render before scrolling
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      scrollToSection(sectionId);
    }
  };

  return (
    <>
      {/* Desktop & Tablet Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-glass-bg backdrop-blur-md border-b border-glass-border">
        <div className="max-w-[1280px] mx-auto px-6 py-2 flex justify-between items-center">
          
          {/* Logo */}
          <div 
            onClick={() => setScreen('home')} 
            className="flex items-center cursor-pointer hover:opacity-90 transition-opacity"
          >
            <img 
              src={logoUrl} 
              alt="STW Media Logo" 
              className="h-20 md:h-24 w-auto object-contain"
            />
          </div>

          {/* Links for Home screen */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = currentScreen === 'home' && activeSection === item.sectionId;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.sectionId)}
                  className={`text-sm tracking-wide font-medium cursor-pointer transition-colors hover:text-vibrant-blue relative pb-1.5 ${
                    isActive ? 'text-vibrant-blue font-semibold' : 'text-on-surface-variant'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-vibrant-blue"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
            <button
              onClick={() => setScreen('contact')}
              className={`text-sm tracking-wide font-bold hover:text-vibrant-blue cursor-pointer transition-colors relative pb-1.5 ${
                currentScreen === 'contact' ? 'text-vibrant-blue font-semibold' : 'text-on-surface-variant'
              }`}
            >
              Contact
              {currentScreen === 'contact' && (
                <motion.div
                  layoutId="activeUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-vibrant-blue"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          </nav>

          {/* Contact Button & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setScreen('contact')}
              className="bg-brand-blue text-white px-6 py-2 rounded-full text-sm font-semibold tracking-wide hover:bg-vibrant-blue transition-all active:scale-95 cursor-pointer shadow-lg shadow-brand-blue/20"
            >
              Book a Call
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 glass-card rounded-lg lg:hidden text-on-surface hover:text-vibrant-blue transition-all cursor-pointer"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-dark-bg/98 backdrop-blur-xl flex flex-col p-6 animate-fade-in">
          <div className="flex justify-between items-center mb-12">
            <img 
              src={logoUrl} 
              alt="STW Media Logo" 
              className="h-24 w-auto object-contain"
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 glass-card rounded-lg text-on-surface hover:text-vibrant-blue transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-6">
            {navItems.map((item) => {
              const isActive = currentScreen === 'home' && activeSection === item.sectionId;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.sectionId)}
                  className={`text-left font-display text-2xl font-bold tracking-tight border-b border-glass-border/50 pb-4 transition-colors cursor-pointer ${
                    isActive ? 'text-vibrant-blue' : 'text-on-surface-variant hover:text-vibrant-blue'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setScreen('contact');
              }}
              className={`text-left font-display text-2xl font-bold tracking-tight border-b border-glass-border/50 pb-4 cursor-pointer transition-colors ${
                currentScreen === 'contact' ? 'text-vibrant-blue' : 'text-transparent bg-clip-text bg-gradient-to-r from-vibrant-blue to-white'
              }`}
            >
              Contact STW
            </button>
          </nav>

          <div className="mt-auto">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setScreen('contact');
              }}
              className="w-full py-4 bg-brand-blue hover:bg-vibrant-blue text-white font-bold tracking-wider rounded-xl transition-all cursor-pointer active:scale-95"
            >
              Contact Us Now
            </button>
          </div>
        </div>
      )}
    </>
  );
}
