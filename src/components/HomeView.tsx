/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { 
  ArrowRight, 
  Sparkles, 
  Film, 
  Eye, 
  Youtube, 
  Linkedin, 
  Instagram, 
  Twitter, 
  Share2, 
  Mail, 
  Lock, 
  Flame,
  TrendingUp,
  Award
} from 'lucide-react';
import { ScreenType, ChannelStat, ServiceItem, ProcessStep } from '../types';
import logoUrl from '../../assets/stw-media-logo.png';
import heroImageUrl from '../../assets/hero-youtube-analytics.jpg';
import productionImageUrl from '../../assets/production-workstation.jpg';

interface HomeViewProps {
  setScreen: (screen: ScreenType) => void;
  scrollToSection: (sectionId: string) => void;
}

interface WorkVideo {
  id: string;
  youtubeId: string;
  label: string;
}

interface OrbitWorkCardProps {
  video: WorkVideo;
  index: number;
  total: number;
  progress: MotionValue<number>;
  isActive: boolean;
}

function OrbitWorkCard({ video, index, total, progress, isActive }: OrbitWorkCardProps) {
  const step = (Math.PI * 2) / total;
  const orbitRotation = useTransform(progress, (value) => value * (total - 1) * step);
  const x = useTransform(orbitRotation, (rotation) => Math.sin(index * step - rotation) * 520);
  const y = useTransform(orbitRotation, (rotation) => Math.sin((index * step - rotation) * 0.5) * 28);
  const scale = useTransform(orbitRotation, (rotation) => {
    const depth = (Math.cos(index * step - rotation) + 1) / 2;
    return 0.68 + depth * 0.32;
  });
  const opacity = useTransform(orbitRotation, (rotation) => {
    const depth = (Math.cos(index * step - rotation) + 1) / 2;
    return 0.16 + depth * 0.84;
  });
  const rotateY = useTransform(orbitRotation, (rotation) => Math.sin(index * step - rotation) * -18);

  return (
    <motion.article
      style={{ x, y, scale, opacity, rotateY, zIndex: isActive ? 30 : 10 }}
      className="absolute left-1/2 top-1/2 w-[82vw] max-w-[760px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.4rem] sm:rounded-[2rem] border border-white/10 bg-[#0e1011] shadow-[0_35px_90px_rgba(0,0,0,0.65)]"
      aria-hidden={!isActive}
    >
      <div className="relative aspect-video overflow-hidden bg-black">
        {isActive ? (
          <iframe
            key={video.youtubeId}
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${video.youtubeId}&controls=0&modestbranding=1&rel=0&playsinline=1`}
            title={`${video.label} — STW Media work`}
            allow="autoplay; encrypted-media; picture-in-picture"
            className="absolute inset-0 h-full w-full pointer-events-none"
          />
        ) : (
          <img
            src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-6">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.24em] text-vibrant-blue">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <h3 className="mt-1 font-display text-lg sm:text-2xl font-extrabold text-white">{video.label}</h3>
          </div>
          {isActive && (
            <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/75 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-vibrant-blue animate-pulse" />
              Playing
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function HomeView({ setScreen, scrollToSection }: HomeViewProps) {
  const { scrollY } = useScroll();
  const slantHeight = useTransform(scrollY, [0, 600], [70, 160]);
  const clipPathStr = useTransform(slantHeight, (h) => `polygon(0 0, 100% 0, 100% calc(100% - ${h}px), 0 100%)`);
  const borderHeightStr = useTransform(slantHeight, (h) => `${h + 1}px`);

  const stats: ChannelStat[] = [
    { id: 'stat-1', value: '15+', label: 'CHANNELS MANAGED', iconName: 'hub' },
    { id: 'stat-2', value: '1.2K+', label: 'VIDEOS PUBLISHED', iconName: 'movie' },
    { id: 'stat-3', value: '50M+', label: 'MONTHLY VIEWS GENERATED', iconName: 'visibility' },
  ];

  const services: ServiceItem[] = [
    { id: 'srv-1', num: '01', title: 'YouTube Strategy', description: 'Comprehensive audits, competitor analysis, and quarterly growth roadmaps built on data, not guesses.' },
    { id: 'srv-2', num: '02', title: 'Content Management', description: 'Handling the daily chaos of production pipelines, editor coordination, and asset tracking.' },
    { id: 'srv-3', num: '03', title: 'Publishing & Optimization', description: 'Thumbnail strategy, semantic SEO descriptions, and rigorous A/B testing for every upload.' },
  ];

  const processSteps: ProcessStep[] = [
    { id: 'step-1', num: '01', phaseName: '01 Strategy', title: 'Foundation Building', description: 'We dig into your existing analytics to find the "magic" that makes your audience stick, then build a growth engine around it.' },
    { id: 'step-2', num: '02', phaseName: '02 Content Planning', title: 'Predictive Programming', description: 'Transforming ideas into formats built for retention. We plan your content calendar 3 months in advance with topics backed by data.' },
    { id: 'step-3', num: '03', phaseName: '03 Production Management', title: 'Operations Excellence', description: 'We manage your editing team, voiceovers, and graphics. No more bottlenecks, no more missed deadlines.' },
    { id: 'step-4', num: '04', phaseName: '04 Publishing & Growth', title: 'Algorithmic Mastery', description: 'Every video is published with maximum SEO and click optimization. We monitor live performance and pivot instantly.' }
  ];

  const workVideos: WorkVideo[] = [
    { id: 'work-1', youtubeId: 'sGnHyLfw68A', label: 'Featured Work 01' },
    { id: 'work-2', youtubeId: '3UOGEjwkZOA', label: 'Featured Work 02' },
    { id: 'work-3', youtubeId: 'gEPfF6BFAB4', label: 'Featured Work 03' },
    { id: 'work-4', youtubeId: '3aBB_yxOE1Q', label: 'Featured Work 04' },
  ];

  const workSectionRef = useRef<HTMLElement | null>(null);
  const [activeWorkIndex, setActiveWorkIndex] = useState(0);
  const { scrollYProgress: workScrollProgress } = useScroll({ target: workSectionRef, offset: ['start start', 'end end'] });

  useMotionValueEvent(workScrollProgress, 'change', (latest) => {
    const nextIndex = Math.min(workVideos.length - 1, Math.max(0, Math.round(latest * (workVideos.length - 1))));
    setActiveWorkIndex((current) => (current === nextIndex ? current : nextIndex));
  });

  const platforms = ['LinkedIn', 'YouTube', 'Meta', 'X', 'YouTube Shorts', 'Instagram'];

  return (
    <div className="relative text-on-surface bg-dark-bg min-h-screen overflow-hidden">
      <div className="absolute top-20 right-[-80px] w-[260px] h-[260px] sm:right-[-100px] sm:w-[500px] sm:h-[500px] bg-brand-blue rounded-full glow-accent pointer-events-none" />
      <div className="absolute top-[1200px] left-[-120px] w-[280px] h-[280px] sm:left-[-200px] sm:w-[600px] sm:h-[600px] bg-vibrant-blue rounded-full glow-accent pointer-events-none" />
      <div className="absolute bottom-[400px] right-[-80px] w-[260px] h-[260px] sm:right-[-100px] sm:w-[500px] sm:h-[500px] bg-brand-blue rounded-full glow-accent pointer-events-none" />

      <section className="relative pt-24 sm:pt-28 pb-20 sm:pb-28 md:pb-40 lg:pt-40 lg:pb-56 px-4 sm:px-6 overflow-hidden">
        <motion.div className="absolute inset-0 bg-gradient-to-b from-[#121414] via-[#1a1c1c]/40 to-[#1e2020]/80 pointer-events-none" style={{ clipPath: clipPathStr, zIndex: 0 }} />
        <motion.div style={{ height: borderHeightStr }} className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="relative block w-full h-full text-glass-border">
            <line x1="0" y1="100" x2="1200" y2="0" stroke="currentColor" strokeWidth="1.2" className="opacity-40" />
          </svg>
        </motion.div>
        <div className="relative z-10 max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.8 }} className="lg:col-span-7 flex flex-col items-start text-left">
            <h1 className="font-display text-[2.35rem] min-[390px]:text-4xl sm:text-5xl md:text-6xl lg:text-[68px] leading-[0.98] tracking-tight font-extrabold text-white mb-5 sm:mb-6">We turn YouTube <br className="hidden sm:inline" />channels into <br /><span className="text-vibrant-blue relative z-10">growth engines.</span></h1>
            <p className="font-sans text-base sm:text-lg md:text-xl text-on-surface-variant max-w-xl mb-8 sm:mb-10 leading-relaxed">STW Media helps creators and brands plan, manage, optimize, and scale their YouTube content with strategies built on data.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button onClick={() => setScreen('contact')} className="bg-brand-blue hover:bg-vibrant-blue text-white font-bold py-3.5 sm:py-4 px-7 sm:px-8 rounded-full text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-blue/30 cursor-pointer text-center">Contact</button>
              <button onClick={() => scrollToSection('work-section')} className="border border-glass-border bg-glass-bg text-on-surface hover:bg-white/10 font-bold py-3.5 sm:py-4 px-7 sm:px-8 rounded-full text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer text-center">See Our Work</button>
            </div>
            <div className="mt-10 lg:hidden w-full"><div className="glass-card p-5 rounded-2xl border-l-[4px] border-l-vibrant-blue"><div className="text-vibrant-blue font-display text-3xl font-extrabold tracking-tight">+240%</div><div className="text-xs text-on-surface-variant font-semibold tracking-wider uppercase mt-1">SUBSCRIBER GROWTH RECORDED</div></div></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false }} transition={{ duration: 0.8, delay: 0.2 }} className="lg:col-span-5 hidden lg:block"><div className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)] hover:scale-[1.01] transition-all duration-500"><img src={heroImageUrl} alt="YouTube analytics dashboard on a laptop" className="w-full h-auto object-contain block" /></div></motion.div>
        </div>
      </section>

      <section className="py-12 sm:py-24 bg-transparent">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-6 text-center"><h3 className="text-[11px] sm:text-xs font-semibold text-on-surface-variant/80 uppercase tracking-[0.3em]">Built for the platforms that shape attention</h3></div>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6"><div className="flex flex-wrap justify-center items-center gap-x-6 sm:gap-x-10 gap-y-4 py-2 text-center">{platforms.map((platform, idx) => <span key={idx} className="text-sm sm:text-base font-medium text-on-surface/40 tracking-wide hover:text-white transition-all duration-300 whitespace-nowrap">{platform}</span>)}</div></div>
      </section>

      <section id="about-section" className="py-16 sm:py-24 lg:py-36 px-4 sm:px-6 bg-black relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_inset_0_-1px_0_rgba(255,255,255,0.05)]">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, margin: '-100px' }} transition={{ duration: 0.6 }} className="lg:col-span-7 flex flex-col text-left">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight font-extrabold text-white mb-6 sm:mb-8">Precise growth <br />for creators with serious momentum.</h2>
            <p className="font-sans text-base sm:text-lg text-on-surface-variant mb-6 leading-relaxed">STW Media is a YouTube growth and content management agency dedicated to bridging the gap between raw creativity and scalable business architecture. We handle the technical weight so you can focus on the lens.</p>
            <p className="font-sans text-base sm:text-lg text-on-surface-variant/80 mb-10 leading-relaxed font-semibold">STW Media is led by founder and CEO Nahom Asfaw.</p>
            <div className="flex flex-col gap-5 mt-4">{stats.map((stat, idx) => <motion.div key={stat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-100px' }} transition={{ duration: 0.5, delay: idx * 0.1 }} whileHover={{ scale: 1.01 }} className="bg-[#121415] border border-[#222425]/70 p-5 sm:p-7 rounded-2xl flex justify-between items-center gap-4 transition-all shadow-[0_15px_30px_rgba(0,0,0,0.5)]"><div><div className="text-vibrant-blue font-display text-3xl sm:text-4xl font-extrabold tracking-tight">{stat.value}</div><div className="text-[10px] sm:text-xs text-on-surface-variant/70 uppercase tracking-widest font-bold mt-1.5">{stat.label}</div></div><div className="text-vibrant-blue flex items-center justify-center opacity-85">{stat.iconName === 'hub' && <Sparkles size={28} strokeWidth={1.5} />}{stat.iconName === 'movie' && <Film size={28} strokeWidth={1.5} />}{stat.iconName === 'visibility' && <Eye size={28} strokeWidth={1.5} />}</div></motion.div>)}</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, margin: '-100px' }} transition={{ duration: 0.6, delay: 0.1 }} className="lg:col-span-5 relative mt-8 lg:mt-0"><div className="relative bg-black/95 rounded-3xl p-4 overflow-hidden border border-glass-border/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"><img src={productionImageUrl} alt="Professional video editing production environment setup timeline" className="w-full aspect-square object-cover rounded-2xl shadow-inner brightness-90 hover:brightness-100 transition-all duration-300" /><div className="absolute inset-0 bg-gradient-to-t from-dark-bg/60 via-transparent to-transparent pointer-events-none" /></div><div className="absolute inset-x-0 -bottom-12 h-24 bg-gradient-to-t from-brand-blue/20 to-transparent blur-xl rounded-full" /></motion.div>
        </div>
      </section>

      <section id="services-section" className="py-16 sm:py-24 lg:py-36 px-4 sm:px-6 bg-surface-container-low/40">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-100px' }} transition={{ duration: 0.6 }} className="max-w-[1280px] mx-auto mb-10 sm:mb-16 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6"><div><span className="text-vibrant-blue text-xs uppercase font-bold tracking-[0.25em] mb-3 block">Our Expertise</span><h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">Complete channel management.</h2></div><p className="font-sans text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed">We provide a comprehensive suite of services designed to move the needle for channels that have hit a plateau.</p></motion.div>
        <div className="max-w-[1280px] mx-auto space-y-6">{services.map((service, idx) => <motion.div key={service.id} onClick={() => setScreen('contact')} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-80px' }} transition={{ duration: 0.5, delay: idx * 0.1 }} whileHover={{ scale: 1.012 }} whileTap={{ scale: 0.995 }} className="group p-[1px] relative cursor-pointer transition-all duration-300" style={{ clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))', backgroundColor: 'rgba(255, 255, 255, 0.12)' }}><div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-brand-blue via-vibrant-blue to-[#00f0ff] transition-opacity duration-500" style={{ clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))' }} /><div className="relative bg-surface-container-low/95 group-hover:bg-[#121415]/95 transition-colors duration-300 p-5 sm:p-8 md:p-10 lg:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 sm:gap-6" style={{ clipPath: 'polygon(0.5px 0.5px, calc(100% - 23.5px) 0.5px, calc(100% - 0.5px) 23.5px, calc(100% - 0.5px) calc(100% - 0.5px), 23.5px calc(100% - 0.5px), 0.5px calc(100% - 23.5px))' }}><div className="flex gap-4 sm:gap-8 items-center w-full md:w-auto"><span className="text-vibrant-blue font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl">{service.num}</span><h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-white group-hover:text-vibrant-blue transition-colors">{service.title}</h3></div><p className="text-sm sm:text-base text-on-surface-variant md:max-w-md lg:max-w-xl group-hover:text-white transition-colors leading-relaxed">{service.description}</p><div className="p-3 rounded-full border border-glass-border group-hover:border-vibrant-blue group-hover:bg-brand-blue/20 text-on-surface-variant group-hover:text-vibrant-blue transition-all shrink-0"><ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" /></div></div></motion.div>)}</div>
      </section>

      <section className="py-16 sm:py-24 lg:py-36 px-4 sm:px-6 bg-dark-bg">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-100px' }} transition={{ duration: 0.6 }} className="max-w-[1280px] mx-auto text-center mb-12 sm:mb-20"><h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">The STW Process</h2><p className="font-sans text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">Our four part approach to scaling attention without sacrificing creative integrity.</p></motion.div>
        <div className="max-w-4xl mx-auto relative px-4 sm:px-8"><div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-brand-blue via-vibrant-blue to-transparent transform -translate-x-1/2 opacity-30" /><div className="space-y-16 relative">{processSteps.map((step, idx) => { const isEven = idx % 2 === 1; return <div key={step.id} className={`flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12 relative ${isEven ? 'md:flex-row-reverse' : ''}`}><motion.div initial={{ opacity: 0, x: isEven ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, margin: '-80px' }} transition={{ duration: 0.6, type: 'spring', stiffness: 80 }} className="w-full md:w-1/2 pl-10 sm:pl-12 md:pl-0"><motion.div whileHover={{ scale: 1.02 }} className={`glass-card p-5 sm:p-8 rounded-2xl border transition-all text-left group cursor-pointer ${!isEven ? 'md:text-right' : 'md:text-left'}`}><span className="text-xs font-bold text-vibrant-blue uppercase tracking-widest mb-2 block">{step.phaseName}</span><h4 className="font-display text-lg sm:text-xl font-extrabold text-white mb-3">{step.title}</h4><p className="text-xs sm:text-sm text-on-surface-variant/90 leading-relaxed group-hover:text-white transition-colors">{step.description}</p></motion.div></motion.div><div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-4 md:top-auto w-5 h-5 rounded-full bg-dark-bg z-10 flex items-center justify-center"><span className="w-3.5 h-3.5 rounded-full bg-vibrant-blue shadow-[0_0_12px_#0099ff] ring-2 ring-vibrant-blue/20" /></div><div className="hidden md:block w-1/2" /></div>; })}</div></div>
      </section>

      <section ref={workSectionRef} id="work-section" className="relative h-[400vh] bg-[#0b0d0e]">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden border-y border-white/[0.06]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,153,255,0.11),transparent_42%)]" />
          <div className="absolute left-1/2 top-1/2 h-[58vw] max-h-[820px] w-[58vw] max-w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />
          <div className="absolute left-1/2 top-1/2 h-[42vw] max-h-[600px] w-[42vw] max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-vibrant-blue/[0.08]" />
          <div className="absolute left-4 right-4 top-8 z-40 mx-auto flex max-w-[1280px] items-start justify-between gap-6 sm:left-6 sm:right-6 sm:top-12"><div><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.28em] text-vibrant-blue sm:text-xs">Selected Work</span><h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">Work in orbit.</h2></div><p className="hidden max-w-sm pt-2 text-right text-sm leading-relaxed text-on-surface-variant md:block">Scroll to revolve through the work. The project facing you plays automatically.</p></div>
          <div className="relative mx-auto h-[70vh] w-full max-w-[1440px]" style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}>{workVideos.map((video, index) => <OrbitWorkCard key={video.id} video={video} index={index} total={workVideos.length} progress={workScrollProgress} isActive={index === activeWorkIndex} />)}</div>
          <div className="absolute bottom-7 left-1/2 z-40 w-[min(560px,82vw)] -translate-x-1/2 sm:bottom-10"><div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-white/45"><span>Scroll to explore</span><span>{String(activeWorkIndex + 1).padStart(2, '0')} / {String(workVideos.length).padStart(2, '0')}</span></div><div className="flex gap-2">{workVideos.map((video, index) => <div key={video.id} className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full origin-left bg-vibrant-blue" animate={{ scaleX: index <= activeWorkIndex ? 1 : 0 }} transition={{ duration: 0.35 }} /></div>)}</div></div>
        </div>
      </section>

      <section id="clients-section" className="py-16 sm:py-24 px-4 sm:px-6 bg-dark-bg"><motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-100px' }} transition={{ duration: 0.6 }} className="max-w-[1280px] mx-auto text-center"><h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-12">Trusted by ambitious creators.</h2><div className="flex flex-wrap justify-center gap-8 sm:gap-16 lg:gap-24 opacity-60">{['Manuel Boza', 'Joon Choi', 'Bite club', 'STW Insights'].map((cli, idx) => <motion.span key={cli} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 0.6, scale: 1 }} viewport={{ once: false }} whileHover={{ scale: 1.08, opacity: 1 }} transition={{ duration: 0.4, delay: idx * 0.08 }} className="font-display text-lg sm:text-xl md:text-2xl font-extrabold text-on-surface hover:text-white transition-all duration-300 tracking-tighter cursor-pointer">{cli}</motion.span>)}</div></motion.div></section>

      <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-[#0c0f0f]/50 border-t border-glass-border"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[500px] sm:h-[500px] bg-vibrant-blue rounded-full glow-accent pointer-events-none" /><motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: false, margin: '-100px' }} transition={{ duration: 0.6 }} className="relative z-10 max-w-4xl mx-auto text-center py-8 sm:py-12"><h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-10 leading-tight">Ready to grow your channel <br />with a real strategy?</h2><button onClick={() => setScreen('contact')} className="bg-brand-blue hover:bg-vibrant-blue text-white font-bold py-4 sm:py-5 px-8 sm:px-12 rounded-full text-base sm:text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand-blue/30 cursor-pointer">Contact STW Media</button></motion.div></section>

      <footer className="w-full px-4 sm:px-6 py-12 sm:py-24 border-t border-glass-border bg-surface-container-lowest"><div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row justify-between items-start gap-12"><div className="flex flex-col items-start text-left max-w-md"><div className="mb-6"><img src={logoUrl} alt="STW Media Logo" className="h-20 sm:h-28 w-auto object-contain" /></div><p className="text-sm text-on-surface-variant leading-relaxed mb-6">Building the future of attention economy for the world's most innovative brands and creators.</p><div className="flex gap-3"><button onClick={() => setScreen('contact')} className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-on-surface-variant hover:text-vibrant-blue hover:border-vibrant-blue transition-all cursor-pointer"><Share2 size={16} /></button><button onClick={() => setScreen('contact')} className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-on-surface-variant hover:text-vibrant-blue hover:border-vibrant-blue transition-all cursor-pointer"><Mail size={16} /></button></div></div><div className="grid grid-cols-1 min-[390px]:grid-cols-2 md:grid-cols-3 gap-x-10 sm:gap-x-20 gap-y-10"><div className="flex flex-col gap-4 text-left"><h5 className="text-xs font-bold text-vibrant-blue uppercase tracking-[0.2em]">Agency</h5><button onClick={() => handleNavClick('about-section')} className="text-sm text-on-surface-variant hover:text-white transition-colors cursor-pointer text-left">About</button><button onClick={() => handleNavClick('services-section')} className="text-sm text-on-surface-variant hover:text-white transition-colors cursor-pointer text-left">Services</button><button onClick={() => handleNavClick('work-section')} className="text-sm text-on-surface-variant hover:text-white transition-colors cursor-pointer text-left">Work</button></div><div className="flex flex-col gap-4 text-left"><h5 className="text-xs font-bold text-vibrant-blue uppercase tracking-[0.2em]">Resources</h5><button onClick={() => handleNavClick('clients-section')} className="text-sm text-on-surface-variant hover:text-white transition-colors cursor-pointer text-left">Clients</button><button onClick={() => setScreen('contact')} className="text-sm text-on-surface-variant hover:text-white transition-colors cursor-pointer text-left">Contact</button><button onClick={() => setScreen('contact')} className="text-sm text-on-surface-variant hover:text-white transition-colors cursor-pointer text-left">Privacy Policy</button></div><div className="flex flex-col gap-4 col-span-2 md:col-span-1 text-left"><p className="text-xs text-on-surface-variant/50 leading-loose">© 2026 STW Media. All rights reserved. Registered Office NY, NY.</p></div></div></div></footer>
    </div>
  );

  function handleNavClick(sectionId: string) {
    scrollToSection(sectionId);
  }
}
