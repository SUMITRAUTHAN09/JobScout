"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Code2,
  DollarSign,
  ExternalLink,
  Globe,
  Key,
  Loader2,
  MapPin,
  Search,
  SortAsc,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fetchLiveJobs, type LiveJob } from "../../lib/jobsapi";
import LocationPicker from "./LocationPicker";

// ─── Predefined skills list ───────────────────────────────────
const SKILL_OPTIONS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Angular",
  "Node.js", "Express", "Python", "Django", "FastAPI", "Java", "Spring",
  "Go", "Rust", "C++", "C#", ".NET", "Ruby", "Rails", "PHP", "Laravel",
  "Swift", "Kotlin", "Flutter", "React Native", "AWS", "Azure", "GCP",
  "Docker", "Kubernetes", "Terraform", "CI/CD", "Git", "SQL", "PostgreSQL",
  "MongoDB", "Redis", "GraphQL", "REST API", "Machine Learning", "AI",
  "Data Science", "Pandas", "TensorFlow", "PyTorch", "Figma", "UI/UX",
];

// ─── Experience options ───────────────────────────────────────
const EXPERIENCE_OPTIONS = [
  "Entry Level (0-1 years)",
  "Junior (1-2 years)",
  "Mid-Level (2-4 years)",
  "Senior (4-6 years)",
  "Lead (6-8 years)",
  "Principal (8+ years)",
];

// ─── AI thinking step pill ────────────────────────────────────
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

// ─── Multi-select skills dropdown ─────────────────────────────
const SkillsMultiSelect = ({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (skills: string[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = SKILL_OPTIONS.filter(
    (s) =>
      s.toLowerCase().includes(filter.toLowerCase()) && !selected.includes(s)
  );

  const toggleSkill = (skill: string) => {
    if (selected.includes(skill)) {
      onChange(selected.filter((s) => s !== skill));
    } else {
      onChange([...selected, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    onChange(selected.filter((s) => s !== skill));
  };

  return (
    <div ref={ref} className="relative">
      <label className="text-xs text-[var(--text-muted)] mb-1.5 flex items-center gap-1.5">
        <Code2 size={11} /> Skills
      </label>
      <div
        onClick={() => setOpen(!open)}
        className="w-full min-h-[46px] bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white cursor-pointer focus-within:border-[#6C63FF]/50 transition-all flex flex-wrap gap-1.5 items-center"
      >
        {selected.length === 0 && (
          <span className="text-[var(--text-muted)]">Select skills...</span>
        )}
        {selected.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-[#6C63FF]/20 text-[#6C63FF] border border-[#6C63FF]/30"
          >
            {skill}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeSkill(skill);
              }}
              className="hover:text-white transition-colors"
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <ChevronDown
          size={14}
          className={`ml-auto text-[var(--text-muted)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute z-50 mt-1 w-full max-h-60 overflow-auto glass rounded-xl border border-white/10 shadow-xl"
          >
            <div className="p-2 border-b border-white/5">
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search skills..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-[var(--text-muted)] focus:border-[#6C63FF]/50 transition-all"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="p-1">
              {filtered.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] p-2 text-center">
                  No skills found
                </p>
              ) : (
                filtered.slice(0, 15).map((skill) => (
                  <button
                    key={skill}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSkill(skill);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[var(--text-secondary)] hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    {skill}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Single job card ──────────────────────────────────────────
const JobCard = ({ job, index }: { job: LiveJob; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index * 0.04, 0.6),
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      className="group glass glass-hover rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden border border-white/5 hover:border-white/12"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#6C63FF]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C63FF]/30 to-[#00D4FF]/20 flex items-center justify-center text-xs font-bold text-white border border-white/10 flex-shrink-0">
            {job.logo}
          </div>
          <div>
            <p className="font-semibold text-white text-sm leading-tight">
              {job.company}
            </p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 flex items-center gap-1">
              <MapPin size={10} />
              {job.location}
              {job.isRemote && (
                <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] bg-green-500/10 text-green-400 border border-green-500/20">
                  Remote
                </span>
              )}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold flex-shrink-0 ${
            job.matchPercent >= 90
              ? "bg-green-500/15 text-green-400 border border-green-500/20"
              : job.matchPercent >= 70
                ? "bg-[#6C63FF]/15 text-[#6C63FF] border border-[#6C63FF]/20"
                : "bg-white/5 text-[var(--text-secondary)] border border-white/10"
          }`}
        >
          <Sparkles size={9} />
          {job.matchPercent}%
        </div>
      </div>

      <h3 className="text-sm font-semibold text-white mb-2 leading-snug">
        {job.role}
      </h3>

      <div className="mb-3">
        <div className="h-0.5 w-full rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${job.matchPercent}%` }}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#00D4FF]"
          />
        </div>
      </div>

      {job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {job.skills.slice(0, 4).map((s: string) => (
            <span
              key={s}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-[var(--text-secondary)] border border-white/5"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-[var(--text-muted)] mb-3">
        <span className="flex items-center gap-1">
          <Clock size={10} />
          {job.postedTime}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase size={10} />
          {job.type}
        </span>
        {job.salary !== "Not disclosed" && job.salary !== "Not specified" && (
          <span className="flex items-center gap-1 text-green-400">
            <DollarSign size={10} />
            {job.salary}
          </span>
        )}
        {job.experience !== "Not specified" && (
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {job.experience}
          </span>
        )}
      </div>

      {job.description && (
        <div className="mb-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-white transition-colors"
          >
            {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            {expanded ? "Hide" : "View"} description
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1.5 text-[11px] text-[var(--text-secondary)] leading-relaxed"
              >
                {job.description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="flex items-center gap-2 pt-3 border-t border-white/5">
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 btn-primary flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium"
        >
          <ExternalLink size={13} />
          Apply Now
        </a>
        <a
          href={job.careerPageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-[var(--text-secondary)] hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
        >
          <Globe size={12} />
          Careers
        </a>
      </div>
    </motion.div>
  );
};

// ─── Steps ────────────────────────────────────────────────────
const STEPS = [
  "Parsing your requirements...",
  "Fetching live jobs from career pages...",
  "Running AI skill matching...",
  "Ranking all results by fit...",
];

// ─── Sort options ─────────────────────────────────────────────
type SortKey = "match" | "recent" | "company";
function sortJobs(jobs: LiveJob[], key: SortKey): LiveJob[] {
  return [...jobs].sort((a, b) => {
    if (key === "match") return b.matchPercent - a.matchPercent;
    if (key === "company") return a.company.localeCompare(b.company);
    if (key === "recent") {
      const toH = (t: string) => {
        const mH = t.match(/(\d+)h/);
        if (mH) return +mH[1];
        const mD = t.match(/(\d+)d/);
        if (mD) return +mD[1] * 24;
        return 9999;
      };
      return toH(a.postedTime) - toH(b.postedTime);
    }
    return 0;
  });
}

// ─── Main component ───────────────────────────────────────────
export default function JobSearch() {
  const [role, setRole] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiKeySet, setApiKeySet] = useState(false);

  const [isSearching, setIsSearching] = useState(false);
  const [stepsDone, setStepsDone] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [allResults, setAllResults] = useState<LiveJob[]>([]);
  const [displayed, setDisplayed] = useState<LiveJob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("match");
  const [filterRemote, setFilterRemote] = useState(false);
  const [page, setPage] = useState(1);

  // FIX: PAGE_SIZE changed from 12 → 30 so all fetched jobs show immediately
  const PAGE_SIZE = 30;

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    if (value.trim().length > 20) {
      setApiKeySet(true);
    }
  };

  const applyFiltersAndSort = (
    jobs: LiveJob[],
    sKey: SortKey,
    remote: boolean
  ) => {
    let filtered = remote ? jobs.filter((j) => j.isRemote) : jobs;
    return sortJobs(filtered, sKey);
  };

  const runSteps = async () => {
    for (let i = 0; i < STEPS.length; i++) {
      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, 650));
      setStepsDone((prev) => [...prev, i]);
    }
  };

  const handleSearch = async () => {
    if (!apiKey.trim()) {
      setError("Please enter your RapidAPI key to search live jobs.");
      return;
    }
    if (!role && selectedSkills.length === 0 && !location) {
      setError("Enter at least a job role, skill, or location.");
      return;
    }

    setIsSearching(true);
    setAllResults([]);
    setDisplayed([]);
    setError(null);
    setStepsDone([]);
    setCurrentStep(0);
    setPage(1);

    const stepsP = runSteps();
    try {
      const skillsString = selectedSkills.join(", ");

      // FIX: pass location correctly; maxPages=3 fetches ~30 jobs in parallel
      const jobs = await fetchLiveJobs(
        role,
        skillsString,
        experience,
        location,   // ← was being passed but ignored in jobsapi.ts before
        apiKey.trim(),
        3           // ← 3 pages × ~10 jobs = ~30 results
      );

      await stepsP;
      const sorted = applyFiltersAndSort(jobs, sortKey, filterRemote);
      setAllResults(sorted);
      // FIX: show all 30 at once (PAGE_SIZE=30), not just first 12
      setDisplayed(sorted.slice(0, PAGE_SIZE));
    } catch (err) {
      await stepsP;
      setError(
        err instanceof Error
          ? err.message
          : "Search failed. Check your API key and try again."
      );
    } finally {
      setIsSearching(false);
      setCurrentStep(-1);
    }
  };

  const handleSortChange = (key: SortKey) => {
    setSortKey(key);
    if (allResults.length === 0) return;
    const sorted = applyFiltersAndSort(allResults, key, filterRemote);
    setAllResults(sorted);
    setDisplayed(sorted.slice(0, page * PAGE_SIZE));
  };

  const handleRemoteToggle = () => {
    const next = !filterRemote;
    setFilterRemote(next);
    if (allResults.length === 0) return;
    const sorted = applyFiltersAndSort(allResults, sortKey, next);
    setAllResults(sorted);
    setPage(1);
    setDisplayed(sorted.slice(0, PAGE_SIZE));
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setDisplayed(allResults.slice(0, nextPage * PAGE_SIZE));
  };

  const hasMore = displayed.length < allResults.length;

  return (
    <section id="search" className="relative py-28 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-[#6C63FF]/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-glow" />
            <span className="text-xs text-[#6C63FF] font-medium">
              Live Job Search
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-semibold tracking-tight mb-4"
          >
            Find Your{" "}
            <span className="font-serif italic gradient-text">Perfect Role</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-[var(--text-secondary)] text-lg"
          >
            Real-time jobs fetched directly from company career pages — worldwide.
          </motion.p>
        </div>

        {/* Search Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            delay: 0.3,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          }}
          className="glass rounded-3xl p-6 md:p-8 mb-6 glow relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#6C63FF]/8 rounded-full blur-3xl pointer-events-none" />

          {/* API Key Section */}
          {!apiKeySet ? (
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Key size={13} className="text-[#6C63FF]" />
                <span className="text-xs font-medium text-[var(--text-secondary)]">
                  RapidAPI Key (required)
                </span>
              </div>
              <div className="glass rounded-xl p-4 border border-[#6C63FF]/20">
                <p className="text-xs text-[var(--text-muted)] mb-2">
                  Get free key →{" "}
                  <a
                    href="https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#6C63FF] hover:underline"
                  >
                    rapidapi.com → JSearch → Subscribe Free
                  </a>{" "}
                  (200 calls/month free)
                </p>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="Paste your RapidAPI key..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[var(--text-muted)] focus:border-[#6C63FF]/50 transition-all"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Key size={13} className="text-[#6C63FF]" />
                <span className="text-xs font-medium text-[var(--text-secondary)]">
                  RapidAPI Key
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                  Set ✓
                </span>
              </div>
              <button
                onClick={() => setApiKeySet(false)}
                className="text-xs text-[#6C63FF] hover:underline"
              >
                Change key
              </button>
            </div>
          )}

          {/* Inputs */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Role */}
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1.5 flex items-center gap-1.5">
                <Briefcase size={11} /> Job Role
              </label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g. Frontend Developer"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[var(--text-muted)] focus:border-[#6C63FF]/50 transition-all"
              />
            </div>

            {/* Skills — Multi-select */}
            <SkillsMultiSelect
              selected={selectedSkills}
              onChange={setSelectedSkills}
            />

            {/* Experience — Dropdown */}
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1.5 flex items-center gap-1.5">
                <Clock size={11} /> Experience
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#6C63FF]/50 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-[#0d0d14]">
                  Any experience
                </option>
                {EXPERIENCE_OPTIONS.map((exp) => (
                  <option key={exp} value={exp} className="bg-[#0d0d14]">
                    {exp}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <LocationPicker value={location} onChange={setLocation} />
          </div>

          {/* Search button + steps */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="btn-primary flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search size={16} />
                  Search Jobs
                </>
              )}
            </button>

            <AnimatePresence>
              {isSearching && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-row flex-wrap items-center gap-x-4 gap-y-1"
                >
                  {STEPS.map((step, i) =>
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

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 glass rounded-xl p-4 border border-red-500/20 flex items-start gap-3"
            >
              <AlertCircle
                size={15}
                className="text-red-400 flex-shrink-0 mt-0.5"
              />
              <div>
                <p className="text-sm text-red-400 font-medium">Search failed</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {error}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {allResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Results toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Showing{" "}
                    <span className="text-white font-semibold">
                      {displayed.length}
                    </span>{" "}
                    of{" "}
                    <span className="text-white font-semibold">
                      {allResults.length}
                    </span>{" "}
                    jobs
                    {role && (
                      <span>
                        {" "}
                        for <span className="text-[#6C63FF]">{role}</span>
                      </span>
                    )}
                    {location && (
                      <span>
                        {" "}
                        in <span className="text-[#00D4FF]">{location}</span>
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Remote toggle */}
                  <button
                    onClick={handleRemoteToggle}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      filterRemote
                        ? "bg-green-500/15 text-green-400 border-green-500/20"
                        : "border-white/10 text-[var(--text-secondary)] hover:text-white hover:border-white/20"
                    }`}
                  >
                    <Globe size={11} />
                    Remote only
                  </button>

                  {/* Sort */}
                  <div className="flex items-center gap-1 glass rounded-lg p-1">
                    <SortAsc
                      size={11}
                      className="text-[var(--text-muted)] ml-1"
                    />
                    {(["match", "recent", "company"] as SortKey[]).map((k) => (
                      <button
                        key={k}
                        onClick={() => handleSortChange(k)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all capitalize ${
                          sortKey === k
                            ? "bg-[#6C63FF] text-white"
                            : "text-[var(--text-secondary)] hover:text-white"
                        }`}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayed.map((job: LiveJob, i: number) => (
                  <JobCard key={job.id} job={job} index={i} />
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div className="mt-10 flex flex-col items-center gap-2">
                  <p className="text-xs text-[var(--text-muted)]">
                    {allResults.length - displayed.length} more jobs available
                  </p>
                  <button
                    onClick={loadMore}
                    className="btn-primary flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-medium"
                  >
                    Load more jobs
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No results state */}
        {!isSearching &&
          allResults.length === 0 &&
          error === null &&
          displayed.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[var(--text-muted)] text-sm">
                Enter your criteria above and search to find matching jobs.
              </p>
            </div>
          )}
      </div>
    </section>
  );
} 