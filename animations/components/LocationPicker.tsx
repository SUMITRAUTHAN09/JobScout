"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, X, ChevronDown, Check } from "lucide-react";

// ─── Country data with flags ──────────────────────────────────
export const COUNTRIES = [
  { code: "REMOTE", name: "Remote / Worldwide",  flag: "🌐" },
  { code: "US",     name: "United States",        flag: "🇺🇸" },
  { code: "GB",     name: "United Kingdom",       flag: "🇬🇧" },
  { code: "IN",     name: "India",                flag: "🇮🇳" },
  { code: "DE",     name: "Germany",              flag: "🇩🇪" },
  { code: "CA",     name: "Canada",               flag: "🇨🇦" },
  { code: "AU",     name: "Australia",            flag: "🇦🇺" },
  { code: "FR",     name: "France",               flag: "🇫🇷" },
  { code: "NL",     name: "Netherlands",          flag: "🇳🇱" },
  { code: "SG",     name: "Singapore",            flag: "🇸🇬" },
  { code: "AE",     name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "JP",     name: "Japan",                flag: "🇯🇵" },
  { code: "BR",     name: "Brazil",               flag: "🇧🇷" },
  { code: "PL",     name: "Poland",               flag: "🇵🇱" },
  { code: "ES",     name: "Spain",                flag: "🇪🇸" },
  { code: "IT",     name: "Italy",                flag: "🇮🇹" },
  { code: "SE",     name: "Sweden",               flag: "🇸🇪" },
  { code: "CH",     name: "Switzerland",          flag: "🇨🇭" },
  { code: "PT",     name: "Portugal",             flag: "🇵🇹" },
  { code: "MX",     name: "Mexico",               flag: "🇲🇽" },
  { code: "AR",     name: "Argentina",            flag: "🇦🇷" },
  { code: "CO",     name: "Colombia",             flag: "🇨🇴" },
  { code: "PK",     name: "Pakistan",             flag: "🇵🇰" },
  { code: "NG",     name: "Nigeria",              flag: "🇳🇬" },
  { code: "ZA",     name: "South Africa",         flag: "🇿🇦" },
  { code: "KR",     name: "South Korea",          flag: "🇰🇷" },
  { code: "IL",     name: "Israel",               flag: "🇮🇱" },
  { code: "TR",     name: "Turkey",               flag: "🇹🇷" },
  { code: "UA",     name: "Ukraine",              flag: "🇺🇦" },
  { code: "RO",     name: "Romania",              flag: "🇷🇴" },
  { code: "CZ",     name: "Czech Republic",       flag: "🇨🇿" },
  { code: "HU",     name: "Hungary",              flag: "🇭🇺" },
  { code: "DK",     name: "Denmark",              flag: "🇩🇰" },
  { code: "NO",     name: "Norway",               flag: "🇳🇴" },
  { code: "FI",     name: "Finland",              flag: "🇫🇮" },
  { code: "BE",     name: "Belgium",              flag: "🇧🇪" },
  { code: "AT",     name: "Austria",              flag: "🇦🇹" },
  { code: "NZ",     name: "New Zealand",          flag: "🇳🇿" },
  { code: "MY",     name: "Malaysia",             flag: "🇲🇾" },
  { code: "ID",     name: "Indonesia",            flag: "🇮🇩" },
  { code: "PH",     name: "Philippines",          flag: "🇵🇭" },
  { code: "TH",     name: "Thailand",             flag: "🇹🇭" },
  { code: "VN",     name: "Vietnam",              flag: "🇻🇳" },
  { code: "EG",     name: "Egypt",                flag: "🇪🇬" },
  { code: "KE",     name: "Kenya",                flag: "🇰🇪" },
  { code: "GH",     name: "Ghana",                flag: "🇬🇭" },
];

export type Country = typeof COUNTRIES[number];

interface LocationPickerProps {
  value: string;          // the location string passed to the API
  onChange: (location: string) => void;
}

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [open,    setOpen]    = useState(false);
  const [query,   setQuery]   = useState("");
  const [selected, setSelected] = useState<Country | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef    = useRef<HTMLInputElement>(null);

  // Filtered list
  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.code.toLowerCase().includes(query.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search when opened
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 80);
  }, [open]);

  const select = useCallback((country: Country) => {
    setSelected(country);
    // "Remote / Worldwide" → pass empty string so API searches globally
    onChange(country.code === "REMOTE" ? "" : country.name);
    setOpen(false);
    setQuery("");
  }, [onChange]);

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(null);
    onChange("");
    setQuery("");
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="text-xs text-[var(--text-muted)] mb-1.5 flex items-center gap-1.5">
        <MapPin size={11} />
        Location
      </label>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 bg-white/5 border rounded-xl px-4 py-3 text-sm transition-all text-left ${
          open
            ? "border-[#6C63FF]/60 bg-white/8"
            : "border-white/10 hover:border-white/20"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {selected ? (
            <>
              <span className="text-base leading-none flex-shrink-0">{selected.flag}</span>
              <span className="text-white truncate">{selected.name}</span>
            </>
          ) : (
            <>
              <MapPin size={14} className="text-[var(--text-muted)] flex-shrink-0" />
              <span className="text-[var(--text-muted)]">e.g. India, United States…</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {selected && (
            <span
              role="button"
              onClick={clear}
              className="p-0.5 rounded-md hover:bg-white/10 transition-colors text-[var(--text-muted)] hover:text-white"
            >
              <X size={12} />
            </span>
          )}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-[var(--text-muted)]"
          >
            <ChevronDown size={14} />
          </motion.span>
        </div>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: -6, scale: 0.98  }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 top-full mt-2 left-0 right-0 glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
            style={{ backdropFilter: "blur(24px)" }}
          >
            {/* Search input inside dropdown */}
            <div className="p-2 border-b border-white/5">
              <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                <Search size={13} className="text-[var(--text-muted)] flex-shrink-0" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search country..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-[var(--text-muted)] outline-none"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-[var(--text-muted)] hover:text-white">
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Country list */}
            <div className="overflow-y-auto max-h-56 py-1">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-[var(--text-muted)]">
                  No countries found
                </div>
              ) : (
                filtered.map((country) => {
                  const isSelected = selected?.code === country.code;
                  return (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => select(country)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm transition-colors text-left ${
                        isSelected
                          ? "bg-[#6C63FF]/20 text-white"
                          : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base leading-none w-6 text-center">{country.flag}</span>
                        <span>{country.name}</span>
                      </div>
                      {isSelected && (
                        <Check size={13} className="text-[#6C63FF] flex-shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer hint */}
            <div className="px-3 py-2 border-t border-white/5">
              <p className="text-[10px] text-[var(--text-muted)]">
                {filtered.length} {filtered.length === 1 ? "country" : "countries"} · Select to filter jobs
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}