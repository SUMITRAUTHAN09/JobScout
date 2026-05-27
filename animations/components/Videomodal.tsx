"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Gauge, Pause, Play, Video, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SPEEDS = [0.5, 1, 1.25, 1.5, 2];

// ─── Video Modal Component ────────────────────────────────────
export default function VideoModal() {
  const [open, setOpen]           = useState(false);
  const [playing, setPlaying]     = useState(false);
  const [speed, setSpeed]         = useState(1);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [duration, setDuration]   = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-play when modal opens, reset when it closes
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (open) {
      v.currentTime = 0;
      v.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    }
  }, [open]);

  // Sync playback speed
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = speed;
  }, [speed]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play();  setPlaying(true);  }
    else          { v.pause(); setPlaying(false); }
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
    setProgress((v.currentTime / v.duration) * 100 || 0);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const val = Number(e.target.value);
    v.currentTime = (val / 100) * v.duration;
    setProgress(val);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* ── Trigger button ───────────────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                   border border-[#00D4FF]/30 bg-[#00D4FF]/8
                   text-[#00D4FF] text-xs font-medium
                   hover:bg-[#00D4FF]/15 hover:border-[#00D4FF]/50
                   transition-all duration-200 group"
      >
        <Video size={12} className="group-hover:scale-110 transition-transform" />
        Watch how to get your free key
        <span className="px-1.5 py-0.5 rounded bg-[#00D4FF]/15 text-[10px]">
          1 min
        </span>
      </button>

      {/* ── Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          // Backdrop
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center
                       bg-black/75 backdrop-blur-sm px-4"
          >
            {/* Modal box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{   opacity: 0, scale: 0.93, y: 24  }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-2xl overflow-hidden
                         border border-white/10 bg-[#0d0d14] shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3
                              border-b border-white/8">
                <div className="flex items-center gap-2">
                  <Video size={14} className="text-[#00D4FF]" />
                  <p className="text-sm font-medium text-white">
                    How to get a free RapidAPI key
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10
                             text-[var(--text-muted)] hover:text-white transition-all"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Video area */}
              <div
                className="relative bg-black aspect-video cursor-pointer group"
                onClick={togglePlay}
              >
                <video
                  ref={videoRef}
                  src="/api-key-guide.mp4"
                  className="w-full h-full object-contain"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setPlaying(false)}
                />

                {/* Centre play/pause overlay — shows on hover or when paused */}
                <div
                  className={`absolute inset-0 flex items-center justify-center
                              transition-opacity duration-200
                              ${!playing ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                >
                  <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm
                                  border border-white/20 flex items-center justify-center">
                    {playing
                      ? <Pause size={22} className="text-white" />
                      : <Play  size={22} className="text-white ml-1" />
                    }
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="px-5 pt-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.1}
                  value={progress}
                  onChange={handleSeek}
                  className="w-full h-1 appearance-none rounded-full cursor-pointer
                             bg-white/10 accent-[#6C63FF]"
                />
                <div className="flex justify-between text-[10px]
                                text-[var(--text-muted)] mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls bar */}
              <div className="flex items-center gap-3 px-5 py-3
                              border-t border-white/8 mt-2">
                {/* Play / Pause button */}
                <button
                  onClick={togglePlay}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                             bg-[#6C63FF] hover:bg-[#5a52e0]
                             text-white text-xs font-medium transition-all"
                >
                  {playing
                    ? <><Pause size={13} /> Pause</>
                    : <><Play  size={13} /> Play</>
                  }
                </button>

                {/* Speed control */}
                <div className="relative">
                  <button
                    onClick={() => setSpeedOpen((v) => !v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                               border border-white/10 hover:border-white/20
                               hover:bg-white/5 text-xs
                               text-[var(--text-secondary)] hover:text-white transition-all"
                  >
                    <Gauge size={13} />
                    {speed}×
                  </button>

                  <AnimatePresence>
                    {speedOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{   opacity: 0, y: 6 }}
                        className="absolute bottom-full mb-2 left-0
                                   bg-[#1a1a2e] border border-white/10
                                   rounded-xl overflow-hidden shadow-xl z-10 min-w-[80px]"
                      >
                        {SPEEDS.map((s) => (
                          <button
                            key={s}
                            onClick={() => { setSpeed(s); setSpeedOpen(false); }}
                            className={`w-full px-4 py-2 text-xs text-left
                                        transition-all hover:bg-white/5
                                        ${speed === s
                                          ? "text-[#6C63FF] font-semibold bg-[#6C63FF]/8"
                                          : "text-[var(--text-secondary)]"
                                        }`}
                          >
                            {s}×
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Esc hint */}
                <p className="ml-auto text-[11px] text-[var(--text-muted)]">
                  Press{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-white/8 text-[10px]">
                    Esc
                  </kbd>{" "}
                  to close
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}