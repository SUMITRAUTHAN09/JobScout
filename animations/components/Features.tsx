"use client";

import { motion, useInView } from "framer-motion";
import {
  Brain,
  Building2,
  Globe,
  RefreshCw,
  Target,
  Zap,
} from "lucide-react";
import { useRef } from "react";

const features = [
  {
    icon: Brain,
    title: "AI Search",
    description:
      "Our AI understands context and semantics to find jobs that truly match your skills — not just keyword matches.",
    color: "#6C63FF",
    gradient: "from-[#6C63FF]/20 to-transparent",
  },
  {
    icon: Globe,
    title: "Career Page Discovery",
    description:
      "We crawl official company career pages directly, giving you access to jobs posted nowhere else.",
    color: "#00D4FF",
    gradient: "from-[#00D4FF]/20 to-transparent",
  },
  {
    icon: Zap,
    title: "Fresh Opportunities",
    description:
      "Jobs indexed within hours of posting — apply before hundreds of other candidates even see the listing.",
    color: "#FFD700",
    gradient: "from-[#FFD700]/20 to-transparent",
  },
  {
    icon: Building2,
    title: "Hidden Startup Jobs",
    description:
      "Discover unadvertised roles at startups and scale-ups who only post on their own career sites.",
    color: "#FF6B9D",
    gradient: "from-[#FF6B9D]/20 to-transparent",
  },
  {
    icon: Target,
    title: "Smart Skill Matching",
    description:
      "Input your tech stack and get a match percentage for every role — prioritize the best fits instantly.",
    color: "#4ADE80",
    gradient: "from-[#4ADE80]/20 to-transparent",
  },
  {
    icon: RefreshCw,
    title: "Real-Time Results",
    description:
      "Live search results updated continuously as new jobs appear on company career pages globally.",
    color: "#FB923C",
    gradient: "from-[#FB923C]/20 to-transparent",
  },
];

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative py-28 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#6C63FF]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-4"
          >
            <span className="text-xs text-[#6C63FF] font-medium">Features</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-semibold tracking-tight mb-4"
          >
            Smarter{" "}
            <span className="font-serif italic gradient-text">
              Job Discovery
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[var(--text-secondary)] max-w-xl mx-auto text-lg"
          >
            Everything you need to find your next role — powered by AI, fueled
            by real company data.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group gradient-border glass glass-hover rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden noise"
              >
                {/* Card glow */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${feature.gradient} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <Icon
                    size={22}
                    style={{ color: feature.color }}
                    strokeWidth={1.5}
                  />
                </div>

                {/* Content */}
                <h3 className="text-base font-semibold text-white mb-2 group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-16 glass rounded-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          {[
            { val: "2,800+", label: "Companies tracked" },
            { val: "15K+", label: "Jobs found weekly" },
            { val: "98%", label: "Match accuracy" },
            { val: "<2h", label: "Average job freshness" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl md:text-3xl font-semibold gradient-text-2 mb-1">
                {stat.val}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}