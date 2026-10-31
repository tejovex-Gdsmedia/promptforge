"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, BarChart3, History, Settings, Menu, X } from "lucide-react";
import { useLocale } from "next-intl";

export default function Navbar() {
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Forge", path: `/${locale}/dashboard/forge`, icon: Sparkles },
    { name: "Analytics", path: `/${locale}/dashboard`, icon: BarChart3 },
    { name: "History", path: `/${locale}/dashboard/history`, icon: History },
    { name: "Settings", path: `/${locale}/dashboard/settings`, icon: Settings },
  ];

  // The locale root is the landing page, which ships its own nav/CTA — skip the dashboard navbar there.
  if (pathname === `/${locale}`) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-void/30 backdrop-blur-xl border-b border-glass-border/30 transition-all duration-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[64px] lg:h-[72px] flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-xl lg:text-2xl font-medium tracking-tight text-text-primary hover:text-gold transition-colors duration-500"
          onClick={() => setOpen(false)}
        >
          PromptForge
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-6 lg:gap-10">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className="magnetic-btn flex items-center gap-2.5 text-[13px] font-medium tracking-wide uppercase text-text-secondary hover:text-gold golden-hover transition-all duration-300 px-3 py-1.5 rounded-full border border-transparent hover:border-gold/20"
            >
              <link.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 -mr-2 text-text-secondary hover:text-text-primary transition-colors"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden border-t border-glass-border/30 bg-void/60 backdrop-blur-xl px-4 py-3 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 text-sm font-medium tracking-wide uppercase text-text-secondary hover:text-gold transition-all duration-300 px-3 py-3 rounded-xl hover:bg-white/5"
            >
              <link.icon className="w-4 h-4" strokeWidth={1.5} />
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
