"use client";

import { motion, useInView } from "framer-motion";
import {
  Building2,
  Hash,
  Layers,
  Star,
  Timer,
  Wifi,
} from "lucide-react";
import { useRef } from "react";

const tips = [
  {
    icon: Hash,
    title: "Use Specific Skill Keywords",
    description:
      "Include exact technologies like 'Next.js 15' or 'React Server Components' — not just 'JavaScript'. Specificity cuts through noise.",
    color: "#6C63FF",
    number: "01",
  },
  {
    icon: Timer,
    title: "Apply Early to Fresh Jobs",
    description:
      "Apply within the first 24 hours. Early applicants are 3x more likely to receive a response from hiring managers.",
    color: "#00D4FF",
    number: "02",
  },
  {
    icon: Building2,
    title: "Search Startup Career Pages",
    description:
      "Startups rarely post on LinkedIn. Their own career pages list roles that never make it to job boards.",
    color: "#FF6B9D",
    number: "03",
  },
  {
    icon: Layers,
    title: "Combine Multiple Skills",
    description:
      "Searching 'React + TypeScript + GraphQL' finds highly specific roles where your exact stack is a perfect match.",
    color: "#FFD700",
    number: "04",
  },
  {
    icon: Wifi,
    title: "Use Remote Filters",
    description:
      "Filter for remote-first companies to access a global job pool. Top startups often prefer remote talent.",
    color: "#4ADE80",
    number: "05",
  },
  {
    icon: Star,
    title: "Track Company Watchlists",
    description:
      "Bookmark dream companies and check their career pages weekly — roles appear and fill fast.",
    color: "#FB923C",
    number: "06",
  },
];

export default function Tips() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="tips" className="relative py-28 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#00D4FF]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-4"
          >
            <span className="text-xs text-[#00D4FF] font-medium">Pro Tips</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-semibold tracking-tight mb-4"
          >
            Search{" "}
            <span className="font-serif italic gradient-text">Smarter</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto"
          >
            Tips from job seekers and hiring managers who've cracked the direct
            application game.
          </motion.p>
        </div>

        {/* Tips grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tips.map((tip, i) => {
            const Icon = tip.icon;
            return (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: 0.1 + i * 0.08,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group glass glass-hover rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Number watermark */}
                <div className="absolute top-4 right-5 text-4xl font-bold text-white/3 group-hover:text-white/6 transition-colors font-serif">
                  {tip.number}
                </div>

                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 duration-300"
                  style={{ backgroundColor: `${tip.color}15` }}
                >
                  <Icon size={20} style={{ color: tip.color }} strokeWidth={1.5} />
                </div>

                <h3 className="text-sm font-semibold text-white mb-2.5">
                  {tip.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {tip.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}