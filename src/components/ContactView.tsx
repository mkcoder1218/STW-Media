/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  Send,
  ArrowLeft,
  Youtube,
  ChevronDown,
  Trash2,
  Sparkles,
  AlertCircle,
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
  monthlyBudget: '$2,000 - $5,000',
  servicesInterested: [],
  message: '',
};

const AVAILABLE_SERVICES = [
  'Full Channel Strategy',
  'Video Production & Editing',
  'Publishing & Search Optimization',
  'Thumbnail Design & Brand System',
];

// Very light email format check on the client for instant feedback.
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export default function ContactView({ setScreen }: ContactViewProps) {
  const [formData, setFormData] = useState<InquiryFormData>(EMPTY_FORM);

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Guard against duplicate submissions racing each other
  const submittingRef = useRef(false);

  // Local debug inbox (localStorage) — preserved from original
  const [submissions, setSubmissions] = useState<InquiryFormData[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('stw_submissions');
    if (saved) {
      try {
        setSubmissions(JSON.parse(saved));
      } catch {
        // ignore malformed cache
      }
    }
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (service: string) => {
    setFormData((prev) => {
      const exists = prev.servicesInterested.includes(service);
      const updated = exists
        ? prev.servicesInterested.filter((s) => s !== service)
        : [...prev.servicesInterested, service];
      return { ...prev, servicesInterested: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    // ── Client-side validation ──
    if (!formData.fullName.trim()) {
      setErrorText('Please enter your full name.');
      return;
    }
    if (!formData.emailAddress.trim()) {
      setErrorText('Please enter your email address.');
      return;
    }
    if (!isValidEmail(formData.emailAddress.trim())) {
      setErrorText('Please enter a valid email address.');
      return;
    }

    // Prevent duplicate submissions
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

      const data: { success: boolean; error?: string; message?: string } =
        await response.json();

      if (!response.ok || !data.success) {
        // Use server-provided message when available, otherwise a generic fallback
        setErrorText(
          data.error ?? 'Something went wrong. Please try again or email us directly.'
        );
        return;
      }

      // ── Success path ──

      // Persist to local debug inbox (same as before)
      const newSubmissions = [formData, ...submissions];
      setSubmissions(newSubmissions);
      localStorage.setItem('stw_submissions', JSON.stringify(newSubmissions));

      // Reset form only after a successful submission
      setFormData(EMPTY_FORM);
      setShowSuccess(true);
    } catch {
      // Network-level failure (offline, DNS, etc.)
      setErrorText(
        'Could not reach the server. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  };

  const clearSubmissions = () => {
    setSubmissions([]);
    localStorage.removeItem('stw_submissions');
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="relative text-on-surface bg-dark-bg min-h-screen pt-32 pb-24 px-6 overflow-hidden">

      {/* Background glow ambient lights */}
      <div className="absolute top-10 left-[-150px] w-[500px] h-[500px] bg-brand-blue rounded-full glow-accent pointer-events-none" />
      <div className="absolute bottom-10 right-[-150px] w-[500px] h-[500px] bg-vibrant-blue rounded-full glow-accent pointer-events-none" />

      <div className="max-w-[760px] mx-auto relative z-10">

        {/* Back button */}
        <button
          onClick={() => setScreen('home')}
          className="flex items-center gap-2 text-on-surface-variant hover:text-white mb-8 group transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        {/* Heading */}
        <div className="text-left mb-12">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Let's scale your channel.
          </h1>
          <p className="text-on-surface-variant font-medium text-base sm:text-lg max-w-xl leading-relaxed">
            Fill out the form below or pick our core services. Nahom and the STW team will prepare an audit and schedule a strategy consultation.
          </p>
        </div>

        {/* ── Success / Form ── */}
        <AnimatePresence mode="wait">
          {showSuccess ? (
            /* ── Success card ── */
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-10 md:p-12 rounded-3xl text-center border-vibrant-blue shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-blue to-vibrant-blue" />

              <div className="mx-auto w-16 h-16 bg-vibrant-blue/20 text-vibrant-blue rounded-full flex items-center justify-center mb-6">
                <Check size={36} />
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-4">
                Inquiry Received!
              </h2>

              <p className="text-on-surface-variant max-w-md mx-auto leading-relaxed mb-8">
                Thank you for reaching out to STW Media. Our media coordinators are analyzing your channel and will contact you within 24 business hours to book our walkthrough.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowSuccess(false)}
                  className="bg-brand-blue hover:bg-vibrant-blue text-white font-bold py-3.5 px-8 rounded-full text-sm uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                >
                  Submit Another Request
                </button>
                <button
                  onClick={() => setScreen('home')}
                  className="border border-glass-border bg-glass-bg text-on-surface hover:bg-white/10 font-bold py-3.5 px-8 rounded-full text-sm uppercase tracking-wider transition-all cursor-pointer text-center"
                >
                  Back to Homepage
                </button>
              </div>
            </motion.div>
          ) : (
            /* ── Inquiry form ── */
            <motion.form
              key="contact-form"
              onSubmit={handleSubmit}
              noValidate
              className="glass-card p-8 sm:p-10 rounded-3xl border border-glass-border/80 flex flex-col gap-6 text-left"
            >

              {/* Error banner */}
              {errorText && (
                <div
                  role="alert"
                  className="flex items-start gap-3 p-4 bg-red-950/40 border border-red-500/30 text-red-200 rounded-xl text-sm font-semibold"
                >
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
                  <span>{errorText}</span>
                </div>
              )}

              {/* Row 1: Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="fullName" className="text-xs uppercase font-bold tracking-wider text-on-surface-variant">
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
                    disabled={isSubmitting}
                    className="w-full bg-[#161818] border border-glass-border rounded-xl px-4 py-3.5 text-white placeholder-on-surface-variant/40 focus:border-vibrant-blue focus:outline-none transition-colors disabled:opacity-60"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="emailAddress" className="text-xs uppercase font-bold tracking-wider text-on-surface-variant">
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
                    disabled={isSubmitting}
                    className="w-full bg-[#161818] border border-glass-border rounded-xl px-4 py-3.5 text-white placeholder-on-surface-variant/40 focus:border-vibrant-blue focus:outline-none transition-colors disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Row 2: Brand + YouTube */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="brandName" className="text-xs uppercase font-bold tracking-wider text-on-surface-variant">
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
                    disabled={isSubmitting}
                    className="w-full bg-[#161818] border border-glass-border rounded-xl px-4 py-3.5 text-white placeholder-on-surface-variant/40 focus:border-vibrant-blue focus:outline-none transition-colors disabled:opacity-60"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="youtubeUrl" className="text-xs uppercase font-bold tracking-wider text-on-surface-variant">
                    YouTube Channel Link
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">
                      <Youtube size={16} />
                    </span>
                    <input
                      type="url"
                      id="youtubeUrl"
                      name="youtubeUrl"
                      value={formData.youtubeUrl}
                      onChange={handleInputChange}
                      placeholder="youtube.com/@channelslug"
                      maxLength={500}
                      disabled={isSubmitting}
                      className="w-full bg-[#161818] border border-glass-border rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-on-surface-variant/40 focus:border-vibrant-blue focus:outline-none transition-colors disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Views + Budget dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="monthlyViews" className="text-xs uppercase font-bold tracking-wider text-on-surface-variant">
                    Current Monthly Views
                  </label>
                  <div className="relative">
                    <select
                      id="monthlyViews"
                      name="monthlyViews"
                      value={formData.monthlyViews}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="w-full bg-[#161818] border border-glass-border rounded-xl px-4 py-3.5 text-white appearance-none focus:border-vibrant-blue focus:outline-none transition-colors disabled:opacity-60"
                    >
                      <option value="< 100k">&lt; 100k Views</option>
                      <option value="100k - 500k">100k – 500k Views</option>
                      <option value="500k - 2M">500k – 2M Views</option>
                      <option value="2M+">2M+ Views/Month</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="monthlyBudget" className="text-xs uppercase font-bold tracking-wider text-on-surface-variant">
                    Monthly Media Budget
                  </label>
                  <div className="relative">
                    <select
                      id="monthlyBudget"
                      name="monthlyBudget"
                      value={formData.monthlyBudget}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="w-full bg-[#161818] border border-glass-border rounded-xl px-4 py-3.5 text-white appearance-none focus:border-vibrant-blue focus:outline-none transition-colors disabled:opacity-60"
                    >
                      <option value="< $2,000">&lt; $2,000 / month</option>
                      <option value="$2,000 - $5,000">$2,000 – $5,000</option>
                      <option value="$5,000 - $10,000">$5,000 – $10,000</option>
                      <option value="$10,000+">$10,000+ / month</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Services checkboxes */}
              <div className="flex flex-col gap-3">
                <span className="text-xs uppercase font-bold tracking-wider text-on-surface-variant">
                  Services You are Interested In
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AVAILABLE_SERVICES.map((service) => {
                    const isChecked = formData.servicesInterested.includes(service);
                    return (
                      <button
                        key={service}
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleCheckboxChange(service)}
                        className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer disabled:opacity-60 ${
                          isChecked
                            ? 'border-vibrant-blue bg-vibrant-blue/10 text-white'
                            : 'border-glass-border bg-[#161818] text-on-surface-variant hover:border-vibrant-blue/50'
                        }`}
                      >
                        <span className="text-sm font-semibold">{service}</span>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                            isChecked ? 'bg-vibrant-blue text-white' : 'border border-glass-border bg-dark-bg'
                          }`}
                        >
                          {isChecked && <Check size={12} strokeWidth={3} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xs uppercase font-bold tracking-wider text-on-surface-variant">
                  Additional Context
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  maxLength={3000}
                  disabled={isSubmitting}
                  placeholder="Tell us about your upload schedule, target audience, or current bottlenecks..."
                  className="w-full bg-[#161818] border border-glass-border rounded-xl px-4 py-3.5 text-white placeholder-on-surface-variant/40 focus:border-vibrant-blue focus:outline-none transition-colors resize-none disabled:opacity-60"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="w-full py-4 bg-brand-blue hover:bg-vibrant-blue text-white font-bold tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending Inquiry…</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Apply for Consultation</span>
                  </>
                )}
              </button>

            </motion.form>
          )}
        </AnimatePresence>

        {/* Local debug inbox */}
        {submissions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 text-left"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Sparkles size={18} className="text-vibrant-blue" />
                Submitted Queries Log ({submissions.length})
              </h3>
              <button
                onClick={clearSubmissions}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 cursor-pointer bg-red-950/20 px-3 py-1.5 rounded-lg border border-red-500/20"
              >
                <Trash2 size={12} /> Clear Log
              </button>
            </div>

            <div className="space-y-4">
              {submissions.map((sub, idx) => (
                <div
                  key={idx}
                  className="glass-card p-6 rounded-2xl border-l-[3px] border-l-brand-blue flex flex-col gap-4"
                >
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-white text-base leading-none mb-1">{sub.fullName}</h4>
                      <span className="text-xs text-on-surface-variant">{sub.emailAddress}</span>
                    </div>
                    {sub.brandName && (
                      <span className="text-xs font-semibold bg-glass-bg px-2.5 py-1 rounded-full border border-glass-border">
                        {sub.brandName}
                      </span>
                    )}
                  </div>

                  {sub.youtubeUrl && (
                    <div className="text-xs text-vibrant-blue truncate flex items-center gap-1">
                      <Youtube size={12} />
                      <a href={sub.youtubeUrl} target="_blank" rel="noreferrer" className="underline hover:text-white">
                        {sub.youtubeUrl}
                      </a>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-xs bg-dark-bg/60 p-3 rounded-lg border border-glass-border/30">
                    <div>
                      <span className="text-on-surface-variant/70 block">Monthly views:</span>
                      <strong className="text-white">{sub.monthlyViews}</strong>
                    </div>
                    <div>
                      <span className="text-on-surface-variant/70 block">Budget range:</span>
                      <strong className="text-white">{sub.monthlyBudget}</strong>
                    </div>
                  </div>

                  {sub.servicesInterested.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {sub.servicesInterested.map((svc) => (
                        <span
                          key={svc}
                          className="text-[10px] bg-brand-blue/10 border border-brand-blue/30 text-vibrant-blue font-bold px-2 py-0.5 rounded"
                        >
                          {svc}
                        </span>
                      ))}
                    </div>
                  )}

                  {sub.message && (
                    <p className="text-xs text-on-surface-variant/90 border-t border-glass-border/30 pt-3 italic">
                      "{sub.message}"
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
