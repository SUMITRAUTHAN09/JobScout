"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Code2,
  ExternalLink,
  Loader2,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import { useRef, useState } from "react";
import { filterJobs, mockJobs, type Job } from "../../lib/jobs";

const AIThinkingStep = ({ label, done }: { label: string; done: boolean }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center gap-2 text-xs text-[var(--text-secondary)]"
  >
    {done ? (
      <CheckCircle2 size={13} className="text-green-400 flex-shrink-0" />
    ) : (
      <Loader2 size={13} className="text-[#6C63FF] animate-spin flex-shrink-0" />
    )}
    <span>{label}</span>
  </motion.div>
);

const JobCard = ({ job, index }: { job: Job; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    className="group gradient-border glass glass-hover rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
  >
    {/* Glow */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#6C63FF]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <div className="flex items-start justify-between mb-4 relative">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#6C63FF]/30 to-[#00D4FF]/20 flex items-center justify-center text-sm font-bold text-white border border-white/10 flex-shrink-0">
          {job.logo}
        </div>
        <div>
          <p className="font-medium text-white text-sm">{job.company}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{job.location}</p>
        </div>
      </div>

      {/* Match badge */}
      <div
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0
          ${
            job.matchPercent >= 90
              ? "bg-green-500/15 text-green-400 border border-green-500/20"
              : job.matchPercent >= 80
              ? "bg-[#6C63FF]/15 text-[#6C63FF] border border-[#6C63FF]/20"
              : "bg-white/5 text-[var(--text-secondary)] border border-white/10"
          }`}
      >
        <Sparkles size={10} />
        {job.matchPercent}% match
      </div>
    </div>

    {/* Role */}
    <h3 className="text-base font-semibold text-white mb-3">{job.role}</h3>

    {/* Match bar */}
    <div className="mb-4">
      <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${job.matchPercent}%` }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#00D4FF]"
        />
      </div>
    </div>

    {/* Skills */}
    <div className="flex flex-wrap gap-1.5 mb-4">
      {job.skills.slice(0, 4).map((skill: string) => (
        <span
          key={skill}
          className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/5 text-[var(--text-secondary)] border border-white/5"
        >
          {skill}
        </span>
      ))}
    </div>

    {/* Meta */}
    <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] mb-4">
      <span className="flex items-center gap-1">
        <Clock size={11} />
        {job.postedTime}
      </span>
      <span className="flex items-center gap-1">
        <Briefcase size={11} />
        {job.type}
      </span>
      <span className="flex items-center gap-1">
        <MapPin size={11} />
        {job.experience}
      </span>
    </div>

    {/* Actions */}
    <div className="flex items-center gap-2 pt-4 border-t border-white/5">
      <a
        href={job.careerPageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 btn-primary flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium"
      >
        <ExternalLink size={14} />
        Apply Now
      </a>
      <a
        href={job.careerPageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
      >
        Career Page
      </a>
    </div>
  </motion.div>
);

const steps = [
  "Parsing your requirements...",
  "Scanning 2,800+ career pages...",
  "Running AI skill matching...",
  "Ranking results by fit...",
];

export default function JobSearch() {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [stepsDone, setStepsDone] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [results, setResults] = useState<Job[] | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleSearch = async () => {
    if (!role && !skills && !experience) return;
    setIsSearching(true);
    setResults(null);
    setStepsDone([]);
    setCurrentStep(0);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, 700));
      setStepsDone((prev) => [...prev, i]);
    }

    const filtered = filterJobs(mockJobs, role, skills, experience);
    await new Promise((r) => setTimeout(r, 300));
    setResults(filtered);
    setIsSearching(false);
    setCurrentStep(-1);
  };

  return (
    <section id="search" className="relative py-28 overflow-hidden" ref={ref}>
      {/* BG */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-1 bg-gradient-to-r from-transparent via-[#6C63FF]/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-4"
          >
            <span className="text-xs text-[#6C63FF] font-medium">AI Job Search</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-semibold tracking-tight mb-4"
          >
            Discover Your{" "}
            <span className="font-serif italic gradient-text">
              Perfect Role
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-[var(--text-secondary)] text-lg"
          >
            Tell our AI what you&apos;re looking for — it handles the rest.
          </motion.p>
        </div>

        {/* Search panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="glass rounded-3xl p-6 md:p-8 mb-8 glow relative overflow-hidden"
        >
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#6C63FF]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00D4FF]/8 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {/* Role */}
            <div className="group">
              <label className="text-xs text-[var(--text-muted)] mb-2 block flex items-center gap-1.5">
                <Briefcase size={11} />
                Job Role
              </label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Frontend Developer"
                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[var(--text-muted)] focus:border-[#6C63FF]/50 focus:bg-white/8 transition-all"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-2 block flex items-center gap-1.5">
                <Code2 size={11} />
                Skills
              </label>
              <input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. React, Next.js, TypeScript"
                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[var(--text-muted)] focus:border-[#6C63FF]/50 focus:bg-white/8 transition-all"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-2 block flex items-center gap-1.5">
                <Clock size={11} />
                Experience
              </label>
              <input
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. 2 Years"
                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[var(--text-muted)] focus:border-[#6C63FF]/50 focus:bg-white/8 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="btn-primary flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSearching ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search size={16} />
                  Search with AI
                </>
              )}
            </button>

            {/* AI thinking steps */}
            <AnimatePresence>
              {isSearching && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-1.5"
                >
                  {steps.map((step, i) =>
                    i <= currentStep ? (
                      <AIThinkingStep
                        key={step}
                        label={step}
                        done={stepsDone.includes(i)}
                      />
                    ) : null
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {results !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-[var(--text-secondary)]">
                  <span className="text-white font-semibold">{results.length}</span>{" "}
                  jobs found matching your profile
                </p>
                <div className="flex items-center gap-1.5 text-xs text-[#4ADE80]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] pulse-glow" />
                  Live results
                </div>
              </div>

              {results.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                  <p className="text-[var(--text-secondary)] mb-2">
                    No jobs found for your query.
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    Try broader keywords or different skills.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {results.map((job: Job, i: number) => (
                    <JobCard key={job.id} job={job} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}