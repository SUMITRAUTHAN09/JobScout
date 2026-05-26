"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe, Sparkles, Zap } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const FloatingCard = ({
  className,
  children,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className={`glass rounded-2xl p-4 absolute ${className}`}
    style={{
      animation: `float ${3 + delay}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
    }}
  >
    {children}
  </motion.div>
);

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-[#6C63FF]/8 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-[#00D4FF]/6 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-[#FF6B9D]/5 blur-[100px] pointer-events-none" />

      {/* Floating dashboard cards */}
      <div className="absolute inset-0 hidden lg:block pointer-events-none">
        <FloatingCard
          className="top-[22%] left-[6%] w-52"
          delay={0.2}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#8B5CF6] flex items-center justify-center text-xs font-bold text-white">V</div>
            <div>
              <p className="text-xs font-medium text-white">Vercel</p>
              <p className="text-[10px] text-[var(--text-muted)]">2 hours ago</p>
            </div>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">Senior Frontend Engineer</p>
          <div className="mt-2 flex items-center gap-1">
            <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full w-[97%] rounded-full bg-gradient-to-r from-[#6C63FF] to-[#00D4FF]" />
            </div>
            <span className="text-[10px] font-medium text-[#6C63FF]">97%</span>
          </div>
        </FloatingCard>

        <FloatingCard
          className="top-[18%] right-[6%] w-48"
          delay={0.5}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles size={12} className="text-[#00D4FF]" />
            <span className="text-[11px] text-[#00D4FF] font-medium">AI Match Found</span>
          </div>
          <p className="text-xs text-white font-medium">React Developer at Linear</p>
          <p className="text-[10px] text-[var(--text-secondary)] mt-1">Remote · Full-time</p>
        </FloatingCard>

        <FloatingCard
          className="bottom-[28%] left-[5%] w-44"
          delay={0.8}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Globe size={12} className="text-[#FF6B9D]" />
            <span className="text-[11px] text-[var(--text-secondary)]">Career pages scanned</span>
          </div>
          <p className="text-2xl font-bold text-white">2,847</p>
          <p className="text-[10px] text-green-400 mt-1">↑ 124 today</p>
        </FloatingCard>

        <FloatingCard
          className="bottom-[30%] right-[5%] w-48"
          delay={0.3}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Zap size={12} className="text-[#6C63FF]" fill="#6C63FF" />
            <span className="text-[11px] text-[var(--text-secondary)]">Jobs found today</span>
          </div>
          <p className="text-2xl font-bold text-white">438</p>
          <p className="text-[10px] text-[#00D4FF] mt-1">From 89 companies</p>
        </FloatingCard>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-glow" />
          <span className="text-xs text-[var(--text-secondary)]">
            AI-powered · Real-time · Career Page Discovery
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.08] mb-6"
        >
          Find Hidden Jobs{" "}
          <br />
          <span className="font-serif italic gradient-text">
            Directly From
          </span>{" "}
          <br />
          Company Career Pages
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          AI-powered job discovery that searches company career pages to find
          fresh opportunities tailored to your skills — before they hit LinkedIn.
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <a
            href="#search"
            className="btn-primary flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-medium"
          >
            <Zap size={16} fill="white" />
            Search Jobs
          </a>
          <a
            href="#features"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-white border border-white/10 hover:border-white/20 transition-all hover:bg-white/5"
          >
            Explore Careers
            <ArrowRight size={15} />
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {[
            { icon: "⚡", label: "AI Powered" },
            { icon: "🔴", label: "Real-Time Search" },
            { icon: "🎯", label: "Career Page Discovery" },
          ].map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 glass rounded-full px-4 py-2"
            >
              <span className="text-sm">{badge.icon}</span>
              <span className="text-xs text-[var(--text-secondary)]">
                {badge.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-widest">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}