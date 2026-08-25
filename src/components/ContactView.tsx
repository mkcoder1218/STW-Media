/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Send,
  Sparkles,
  Trash2,
  Youtube,
} from 'lucide-react';
import { InquiryFormData, ScreenType } from '../types';

interface ContactViewProps {
  setScreen: (screen: ScreenType) => void;
}

const EMPTY_FORM: InquiryFormData = {
  fullName: '',
  emailAddress: '',
  brandName: '',
  youtubeUrl: '',
  monthlyViews: '< 100k',
  monthlyBudget: '$500 to $2,000',
  servicesInterested: [],
  message: '',
};

const AVAILABLE_SERVICES = [
  'Full Channel Strategy',
  'Video Production & Editing',
  'Publishing & Search Optimization',
  'Thumbnail Design & Brand System',
];

const STEPS = [
  {
    eyebrow: 'About You',
    title: "Let's start with you.",
    description: 'A couple of details so we know who we are building the audit for.',
  },
  {
    eyebrow: 'Your Channel',
    title: 'Now, show us your channel.',
    description: 'Give us a quick snapshot of the brand and the audience you are growing.',
  },
  {
    eyebrow: 'Your Goals',
    title: 'What should we help you grow?',
    description: 'Choose the areas where you want STW Media to make the biggest difference.',
  },
  {
    eyebrow: 'Final Details',
    title: 'One last thing.',
    description: 'Add anything useful, review your choices, and we will take it from here.',
  },
];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

const stepVariants = {
  initial: {
    opacity: 0,
    x: 32,
    y: 22,
    filter: 'blur(5px)',
  },
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -18,
    filter: 'blur(6px)',
    transition: {
      duration: 0.24,
      ease: 'easeIn',
    },
  },
};

const fieldVariants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ContactView({ setScreen }: ContactViewProps) {
  const [formData, setFormData] = useState<InquiryFormData>(EMPTY_FORM);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorText, setErrorText] = useState('');
  const submittingRef = useRef(false);
  const [submissions, setSubmissions] = useState<InquiryFormData[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('stw_submissions');
    if (saved) {
      try {
        setSubmissions(JSON.parse(saved));
      } catch {
        // Ignore malformed cache.
      }
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorText) setErrorText('');
  };

  const handleCheckboxChange = (service: string) => {
    setFormData((prev) => {
      const exists = prev.servicesInterested.includes(service);
      return {
        ...prev,
        servicesInterested: exists
          ? prev.servicesInterested.filter((item) => item !== service)
          : [...prev.servicesInterested, service],
      };
    });
    if (errorText) setErrorText('');
  };

  const validateStep = (step: number): boolean => {
    setErrorText('');

    if (step === 1) {
      if (!formData.fullName.trim()) {
        setErrorText('Please enter your full name before continuing.');
        return false;
      }
      if (!formData.emailAddress.trim()) {
        setErrorText('Please enter your email address before continuing.');
        return false;
      }
      if (!isValidEmail(formData.emailAddress.trim())) {
        setErrorText('Please enter a valid email address.');
        return false;
      }
    }

    return true;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((step) => Math.min(step + 1, STEPS.length));
  };

  const goBack = () => {
    setErrorText('');
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!validateStep(1)) {
      setCurrentStep(1);
      return;
    }

    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName.trim(),
          email: formData.emailAddress.trim(),
          brandName: formData.brandName.trim(),
          youtubeUrl: formData.youtubeUrl.trim(),
          monthlyViews: formData.monthlyViews,
          monthlyBudget: formData.monthlyBudget,
          servicesInterested: formData.servicesInterested,
          message: formData.message.trim(),
        }),
      });

      const data: { success: boolean; error?: string; message?: string } = await response.json();

      if (!response.ok || !data.success) {
        setErrorText(data.error ?? 'Something went wrong. Please try again or email us directly.');
        return;
      }

      const newSubmissions = [formData, ...submissions];
      setSubmissions(newSubmissions);
      localStorage.setItem('stw_submissions', JSON.stringify(newSubmissions));

      setFormData(EMPTY_FORM);
      setCurrentStep(1);
      setShowSuccess(true);
    } catch {
      setErrorText('Could not reach the server. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  };

  const clearSubmissions = () => {
    setSubmissions([]);
    localStorage.removeItem('stw_submissions');
  };

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;
  const activeStep = STEPS[currentStep - 1];

  return (
    <div className="relative min-h-screen overflow-hidden bg-dark-bg px-4 pb-16 pt-24 text-on-surface sm:px-6 sm:pb-24 sm:pt-32">
      <div className="pointer-events-none absolute left-[-90px] top-10 h-[260px] w-[260px] rounded-full bg-brand-blue glow-accent sm:left-[-150px] sm:h-[500px] sm:w-[500px]" />
      <div className="pointer-events-none absolute bottom-10 right-[-90px] h-[260px] w-[260px] rounded-full bg-vibrant-blue glow-accent sm:right-[-150px] sm:h-[500px] sm:w-[500px]" />

      <div className="relative z-10 mx-auto max-w-[1240px]">
        <button
          onClick={() => setScreen('home')}
          className="group mb-8 flex cursor-pointer items-center gap-2 text-on-surface-variant transition-colors hover:text-white sm:mb-10"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </button>

        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="glass-card relative mx-auto max-w-[760px] overflow-hidden rounded-2xl border-vibrant-blue p-6 text-center shadow-2xl sm:rounded-3xl sm:p-10 md:p-12"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand-blue to-vibrant-blue" />
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-vibrant-blue/20 text-vibrant-blue">
                <Check size={36} />
              </div>
              <h2 className="mb-4 font-display text-2xl font-extrabold text-white sm:text-3xl">
                Inquiry Received!
              </h2>
              <p className="mx-auto mb-8 max-w-md leading-relaxed text-on-surface-variant">
                Thank you for reaching out to STW Media. Our media coordinators are analyzing your channel and will contact you within 24 business hours to book our walkthrough.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setErrorText('');
                    setShowSuccess(false);
                  }}
                  className="cursor-pointer rounded-full bg-brand-blue px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-vibrant-blue active:scale-95"
                >
                  Submit Another Request
                </button>
                <button
                  onClick={() => setScreen('home')}
                  className="cursor-pointer rounded-full border border-glass-border bg-glass-bg px-8 py-3.5 text-center text-sm font-bold uppercase tracking-wider text-on-surface transition-all hover:bg-white/10"
                >
                  Back to Homepage
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="guided-form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid items-start gap-8 lg:grid-cols-[0.78fr_1.42fr] lg:gap-12 xl:gap-16"
            >
              <aside className="min-w-0 lg:pt-4">
                <div className="mb-8 max-w-[520px] lg:mb-10">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-vibrant-blue">
                    Strategy consultation
                  </p>
                  <h1 className="mb-5 font-display text-4xl font-extrabold leading-[1.02] text-white sm:text-5xl xl:text-6xl">
                    Let's scale your channel.
                  </h1>
                  <p className="max-w-md text-base font-medium leading-relaxed text-on-surface-variant sm:text-lg">
                    A guided two-minute intake. We will turn your answers into a focused channel audit and strategy conversation.
                  </p>
                </div>

                <div className="mb-7 flex items-center gap-2 text-sm font-semibold text-on-surface-variant">
                  <Clock3 size={16} className="text-vibrant-blue" />
                  Takes about 2 minutes
                </div>

                <div className="relative hidden max-w-[420px] lg:block">
                  <div className="absolute bottom-5 left-[19px] top-5 w-px bg-glass-border/80" />
                  <motion.div
                    className="absolute left-[19px] top-5 w-px origin-top bg-vibrant-blue"
                    initial={false}
                    animate={{ height: `calc(${progress}% - ${progress === 100 ? 40 : 0}px)` }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />

                  <div className="relative flex flex-col gap-6">
                    {STEPS.map((step, index) => {
                      const stepNumber = index + 1;
                      const isActive = currentStep === stepNumber;
                      const isComplete = currentStep > stepNumber;

                      return (
                        <div key={step.eyebrow} className="flex items-start gap-4">
                          <motion.div
                            animate={{
                              scale: isActive ? 1.08 : 1,
                              borderColor: isActive || isComplete ? 'rgb(44 122 255)' : 'rgba(255,255,255,0.16)',
                              backgroundColor: isComplete ? 'rgb(44 122 255)' : 'rgb(17 19 19)',
                            }}
                            className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-extrabold transition-colors ${
                              isActive ? 'text-white' : isComplete ? 'text-white' : 'text-on-surface-variant'
                            }`}
                          >
                            {isComplete ? <Check size={15} strokeWidth={3} /> : `0${stepNumber}`}
                          </motion.div>
                          <div className="pt-1">
                            <p className={`text-sm font-bold transition-colors ${isActive ? 'text-white' : 'text-on-surface-variant'}`}>
                              {step.eyebrow}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-on-surface-variant/60">
                              {stepNumber === 1 && 'Your name and contact'}
                              {stepNumber === 2 && 'Channel and audience'}
                              {stepNumber === 3 && 'Services and budget'}
                              {stepNumber === 4 && 'Context and review'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-8 grid grid-cols-4 gap-2 lg:hidden">
                  {STEPS.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = currentStep === stepNumber;
                    const isComplete = currentStep > stepNumber;
                    return (
                      <div key={step.eyebrow} className="min-w-0">
                        <div className={`mb-2 h-1.5 rounded-full transition-colors ${isComplete || isActive ? 'bg-vibrant-blue' : 'bg-glass-border/70'}`} />
                        <span className={`block truncate text-[10px] font-bold uppercase tracking-wide ${isActive ? 'text-white' : 'text-on-surface-variant/60'}`}>
                          0{stepNumber}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {(formData.fullName || formData.brandName || currentStep > 1) && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hidden max-w-[420px] border-t border-glass-border/60 pt-6 lg:block"
                  >
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant/60">
                      Your details
                    </p>
                    <div className="space-y-1.5 text-sm">
                      {formData.fullName && <p className="font-bold text-white">{formData.fullName}</p>}
                      {formData.brandName && <p className="text-on-surface-variant">{formData.brandName}</p>}
                      {currentStep >= 3 && <p className="text-on-surface-variant">{formData.monthlyViews} monthly views</p>}
                      {currentStep >= 4 && formData.servicesInterested.length > 0 && (
                        <p className="text-vibrant-blue">{formData.servicesInterested.length} service{formData.servicesInterested.length > 1 ? 's' : ''} selected</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </aside>

              <form onSubmit={handleSubmit} noValidate className="min-w-0">
                <div className="glass-card overflow-hidden rounded-2xl border border-glass-border/80 sm:rounded-3xl">
                  <div className="border-b border-glass-border/60 px-5 py-5 sm:px-8 sm:py-6 md:px-10">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-vibrant-blue">
                          Step 0{currentStep} / 0{STEPS.length}
                        </p>
                        <p className="mt-1 text-sm text-on-surface-variant">{activeStep.eyebrow}</p>
                      </div>
                      <span className="text-xs font-bold text-on-surface-variant">{Math.round((currentStep / STEPS.length) * 100)}%</span>
                    </div>
                    <div className="mt-4 h-1 overflow-hidden rounded-full bg-glass-border/50">
                      <motion.div
                        className="h-full rounded-full bg-vibrant-blue"
                        initial={false}
                        animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </div>

                  <div className="px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-9">
                    <AnimatePresence mode="wait">
                      <motion.section
                        key={currentStep}
                        variants={stepVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="min-h-[430px]"
                      >
                        <motion.div variants={fieldVariants} className="mb-8">
                          <h2 className="font-display text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                            {activeStep.title}
                          </h2>
                          <p className="mt-3 max-w-2xl leading-relaxed text-on-surface-variant">
                            {activeStep.description}
                          </p>
                        </motion.div>

                        {errorText && (
                          <motion.div
                            variants={fieldVariants}
                            role="alert"
                            className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-sm font-semibold text-red-200"
                          >
                            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
                            <span>{errorText}</span>
                          </motion.div>
                        )}

                        {currentStep === 1 && (
                          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
                            <motion.div variants={fieldVariants} className="flex flex-col gap-2">
                              <label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                Full Name *
                              </label>
                              <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="e.g. Sarah Jenkins"
                                required
                                maxLength={120}
                                autoComplete="name"
                                className="w-full rounded-xl border border-glass-border bg-[#161818] px-4 py-4 text-white outline-none transition-colors placeholder:text-on-surface-variant/40 focus:border-vibrant-blue"
                              />
                            </motion.div>

                            <motion.div variants={fieldVariants} className="flex flex-col gap-2">
                              <label htmlFor="emailAddress" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                Email Address *
                              </label>
                              <input
                                type="email"
                                id="emailAddress"
                                name="emailAddress"
                                value={formData.emailAddress}
                                onChange={handleInputChange}
                                placeholder="sarah@yourbrand.com"
                                required
                                maxLength={254}
                                autoComplete="email"
                                className="w-full rounded-xl border border-glass-border bg-[#161818] px-4 py-4 text-white outline-none transition-colors placeholder:text-on-surface-variant/40 focus:border-vibrant-blue"
                              />
                            </motion.div>

                            <motion.div variants={fieldVariants} className="md:col-span-2 mt-2 rounded-xl border border-glass-border/50 bg-white/[0.025] p-4 text-sm leading-relaxed text-on-surface-variant">
                              We only use these details to prepare your audit and follow up about the consultation.
                            </motion.div>
                          </div>
                        )}

                        {currentStep === 2 && (
                          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
                            <motion.div variants={fieldVariants} className="flex flex-col gap-2">
                              <label htmlFor="brandName" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                Brand / Channel Name
                              </label>
                              <input
                                type="text"
                                id="brandName"
                                name="brandName"
                                value={formData.brandName}
                                onChange={handleInputChange}
                                placeholder="e.g. Jenkins Tech Insights"
                                maxLength={120}
                                className="w-full rounded-xl border border-glass-border bg-[#161818] px-4 py-4 text-white outline-none transition-colors placeholder:text-on-surface-variant/40 focus:border-vibrant-blue"
                              />
                            </motion.div>

                            <motion.div variants={fieldVariants} className="flex flex-col gap-2">
                              <label htmlFor="youtubeUrl" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                YouTube Channel Link
                              </label>
                              <div className="relative">
                                <Youtube size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
                                <input
                                  type="url"
                                  id="youtubeUrl"
                                  name="youtubeUrl"
                                  value={formData.youtubeUrl}
                                  onChange={handleInputChange}
                                  placeholder="youtube.com/@channelslug"
                                  maxLength={500}
                                  className="w-full rounded-xl border border-glass-border bg-[#161818] py-4 pl-12 pr-4 text-white outline-none transition-colors placeholder:text-on-surface-variant/40 focus:border-vibrant-blue"
                                />
                              </div>
                            </motion.div>

                            <motion.div variants={fieldVariants} className="flex flex-col gap-2 md:col-span-2">
                              <label htmlFor="monthlyViews" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                Current Monthly Views
                              </label>
                              <div className="relative">
                                <select
                                  id="monthlyViews"
                                  name="monthlyViews"
                                  value={formData.monthlyViews}
                                  onChange={handleInputChange}
                                  className="w-full appearance-none rounded-xl border border-glass-border bg-[#161818] px-4 py-4 text-white outline-none transition-colors focus:border-vibrant-blue"
                                >
                                  <option value="< 100k">&lt; 100k Views</option>
                                  <option value="100k to 500k">100k to 500k Views</option>
                                  <option value="500k to 2M">500k to 2M Views</option>
                                  <option value="2M+">2M+ Views/Month</option>
                                </select>
                                <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                              </div>
                            </motion.div>
                          </div>
                        )}

                        {currentStep === 3 && (
                          <div className="space-y-7">
                            <motion.div variants={fieldVariants}>
                              <span className="mb-3 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                Services you are interested in
                              </span>
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {AVAILABLE_SERVICES.map((service) => {
                                  const isChecked = formData.servicesInterested.includes(service);
                                  return (
                                    <button
                                      key={service}
                                      type="button"
                                      onClick={() => handleCheckboxChange(service)}
                                      className={`group flex min-h-[84px] cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-all sm:p-5 ${
                                        isChecked
                                          ? 'border-vibrant-blue bg-vibrant-blue/10 text-white shadow-[0_0_0_1px_rgba(44,122,255,0.18)]'
                                          : 'border-glass-border bg-[#161818] text-on-surface-variant hover:border-vibrant-blue/50 hover:bg-white/[0.035]'
                                      }`}
                                    >
                                      <span className="text-sm font-bold leading-snug">{service}</span>
                                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all ${isChecked ? 'border-vibrant-blue bg-vibrant-blue text-white' : 'border-glass-border bg-dark-bg'}`}>
                                        {isChecked && <Check size={13} strokeWidth={3} />}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>

                            <motion.div variants={fieldVariants} className="flex flex-col gap-2">
                              <label htmlFor="monthlyBudget" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                Monthly Media Budget
                              </label>
                              <div className="relative">
                                <select
                                  id="monthlyBudget"
                                  name="monthlyBudget"
                                  value={formData.monthlyBudget}
                                  onChange={handleInputChange}
                                  className="w-full appearance-none rounded-xl border border-glass-border bg-[#161818] px-4 py-4 text-white outline-none transition-colors focus:border-vibrant-blue"
                                >
                                  <option value="$500 to $2,000">$500 to $2,000</option>
                                  <option value="$2,000 to $5,000">$2,000 to $5,000</option>
                                  <option value="$5,000 to $10,000">$5,000 to $10,000</option>
                                  <option value="$10,000+">$10,000+</option>
                                </select>
                                <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                              </div>
                            </motion.div>
                          </div>
                        )}

                        {currentStep === 4 && (
                          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                            <motion.div variants={fieldVariants} className="flex flex-col gap-2">
                              <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                Additional Context
                              </label>
                              <textarea
                                id="message"
                                name="message"
                                rows={8}
                                value={formData.message}
                                onChange={handleInputChange}
                                maxLength={3000}
                                placeholder="Tell us about your upload schedule, target audience, current bottlenecks, or what success looks like..."
                                className="min-h-[220px] w-full resize-none rounded-xl border border-glass-border bg-[#161818] px-4 py-4 text-white outline-none transition-colors placeholder:text-on-surface-variant/40 focus:border-vibrant-blue"
                              />
                            </motion.div>

                            <motion.div variants={fieldVariants} className="rounded-2xl border border-glass-border/70 bg-[#151717] p-5">
                              <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-vibrant-blue">Your brief</p>
                              <div className="space-y-4 text-sm">
                                <div>
                                  <span className="block text-xs text-on-surface-variant/60">Name</span>
                                  <strong className="mt-1 block text-white">{formData.fullName || '—'}</strong>
                                </div>
                                <div>
                                  <span className="block text-xs text-on-surface-variant/60">Channel</span>
                                  <strong className="mt-1 block break-words text-white">{formData.brandName || 'Not added'}</strong>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <span className="block text-xs text-on-surface-variant/60">Views</span>
                                    <strong className="mt-1 block text-white">{formData.monthlyViews}</strong>
                                  </div>
                                  <div>
                                    <span className="block text-xs text-on-surface-variant/60">Budget</span>
                                    <strong className="mt-1 block text-white">{formData.monthlyBudget}</strong>
                                  </div>
                                </div>
                                <div>
                                  <span className="mb-2 block text-xs text-on-surface-variant/60">Services</span>
                                  {formData.servicesInterested.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                      {formData.servicesInterested.map((service) => (
                                        <span key={service} className="rounded-full border border-brand-blue/30 bg-brand-blue/10 px-2.5 py-1 text-[10px] font-bold text-vibrant-blue">
                                          {service}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-sm text-on-surface-variant">No services selected yet</span>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        )}
                      </motion.section>
                    </AnimatePresence>

                    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-glass-border/50 pt-6 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        onClick={goBack}
                        disabled={currentStep === 1 || isSubmitting}
                        className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition-all sm:justify-start ${
                          currentStep === 1
                            ? 'pointer-events-none opacity-0'
                            : 'border border-glass-border bg-white/[0.025] text-on-surface-variant hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        <ArrowLeft size={16} />
                        Back
                      </button>

                      {currentStep < STEPS.length ? (
                        <button
                          type="button"
                          onClick={goNext}
                          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-blue px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-blue/20 transition-all hover:bg-vibrant-blue active:scale-[0.98]"
                        >
                          Continue
                          <ArrowRight size={16} />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          aria-busy={isSubmitting}
                          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-blue px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-blue/20 transition-all hover:bg-vibrant-blue active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              Sending Inquiry…
                            </>
                          ) : (
                            <>
                              <Send size={16} />
                              Get My Channel Audit
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {submissions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-left sm:mt-16"
          >
            <div className="mb-6 flex flex-col gap-3 min-[390px]:flex-row min-[390px]:items-center min-[390px]:justify-between">
              <h3 className="flex items-center gap-2 font-display text-base font-bold text-white sm:text-lg">
                <Sparkles size={18} className="text-vibrant-blue" />
                Submitted Queries Log ({submissions.length})
              </h3>
              <button
                onClick={clearSubmissions}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-950/20 px-3 py-1.5 text-xs text-red-400 hover:text-red-300"
              >
                <Trash2 size={12} /> Clear Log
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {submissions.map((sub, idx) => (
                <div
                  key={`${sub.emailAddress}-${idx}`}
                  className="glass-card flex flex-col gap-4 rounded-2xl border-l-[3px] border-l-brand-blue p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h4 className="mb-1 text-base font-bold leading-none text-white">{sub.fullName}</h4>
                      <span className="text-xs text-on-surface-variant">{sub.emailAddress}</span>
                    </div>
                    {sub.brandName && (
                      <span className="rounded-full border border-glass-border bg-glass-bg px-2.5 py-1 text-xs font-semibold">
                        {sub.brandName}
                      </span>
                    )}
                  </div>

                  {sub.youtubeUrl && (
                    <div className="flex items-center gap-1 truncate text-xs text-vibrant-blue">
                      <Youtube size={12} />
                      <a href={sub.youtubeUrl} target="_blank" rel="noreferrer" className="truncate underline hover:text-white">
                        {sub.youtubeUrl}
                      </a>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3 rounded-lg border border-glass-border/30 bg-dark-bg/60 p-3 text-xs min-[390px]:grid-cols-2 sm:gap-4">
                    <div>
                      <span className="block text-on-surface-variant/70">Monthly views:</span>
                      <strong className="text-white">{sub.monthlyViews}</strong>
                    </div>
                    <div>
                      <span className="block text-on-surface-variant/70">Budget range:</span>
                      <strong className="text-white">{sub.monthlyBudget}</strong>
                    </div>
                  </div>

                  {sub.servicesInterested.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {sub.servicesInterested.map((service) => (
                        <span key={service} className="rounded border border-brand-blue/30 bg-brand-blue/10 px-2 py-0.5 text-[10px] font-bold text-vibrant-blue">
                          {service}
                        </span>
                      ))}
                    </div>
                  )}

                  {sub.message && (
                    <p className="border-t border-glass-border/30 pt-3 text-xs italic text-on-surface-variant/90">
                      “{sub.message}”
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
