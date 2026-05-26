"use client";

import { Github, Linkedin, Mail, Shield, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-white/5 py-16 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#6C63FF]/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center">
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <span className="font-semibold text-[15px] tracking-tight text-white">
                Career<span className="gradient-text-2">AI</span>
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
              AI-powered job discovery that finds opportunities directly from
              company career pages — before they appear on traditional portals.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-widest mb-4">
              Navigation
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Features", href: "#features" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "Search Jobs", href: "#search" },
                { label: "Tips", href: "#tips" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors w-fit"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-widest mb-4">
              Connect
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)] hover:text-white transition-colors w-fit"
              >
                <Github size={15} />
                GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)] hover:text-white transition-colors w-fit"
              >
                <Linkedin size={15} />
                LinkedIn
              </a>
              <a
                href="mailto:hello@careerai.dev"
                className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)] hover:text-white transition-colors w-fit"
              >
                <Mail size={15} />
                Contact
              </a>
              <a
                href="#"
                className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)] hover:text-white transition-colors w-fit"
              >
                <Shield size={15} />
                Privacy Policy
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            © 2024 CareerAI. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Built with ❤️ by{" "}
            <span className="text-[#6C63FF] font-medium">Sumit</span>
          </p>
        </div>
      </div>
    </footer>
  );
}