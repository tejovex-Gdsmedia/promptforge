"use client";
import GlassCard from "@/components/shared/GlassCard";
import NoiseOverlay from "@/components/shared/NoiseOverlay";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-void text-text-primary overflow-x-hidden">
      <NoiseOverlay />

      {/* Subtle ambient gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-[#1a1a1a] via-[#030303] to-transparent opacity-50 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-[#111] via-[#030303] to-transparent opacity-40 blur-[100px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-20 md:mb-32 gap-3">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white text-void flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-lg sm:text-xl font-semibold tracking-tight">PromptForge</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="#features" className="hidden sm:inline-block text-sm text-text-secondary hover:text-white transition-colors px-4 py-2">Features</Link>
            <Link href="#pricing" className="hidden sm:inline-block text-sm text-text-secondary hover:text-white transition-colors px-4 py-2">Pricing</Link>
            <a href="/en/dashboard/forge" className="text-sm bg-white text-void px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-medium hover:bg-[#f0f0f0] transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] whitespace-nowrap">Get Started</a>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-24 md:mb-48">
          <div className="space-y-8 lg:space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-glass border border-glass-border text-xs font-medium text-text-secondary tracking-wide mb-8">
                <Zap className="w-3 h-3" /> AI-Powered Prompt Engineering
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-8xl font-medium leading-[0.95] md:leading-[0.9] tracking-tight mb-6 md:mb-8">
                Forge prompts<br />
                <span className="italic text-text-muted">that actually work.</span>
              </h1>
            </motion.div>
            <motion.p
              className="text-base sm:text-xl text-text-secondary leading-relaxed max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              A cinematic workspace for professionals who refuse to settle for mediocre AI output. Transform vague ideas into structured, world-class prompts.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <a href="/en/dashboard/forge" className="inline-flex items-center justify-center gap-2.5 bg-white text-void px-8 py-4 rounded-full font-semibold text-base shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:bg-[#f0f0f0] hover:shadow-[0_0_50px_rgba(255,255,255,0.35)] transition-all duration-500 hover:-translate-y-0.5">
                Start Forging <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/en/dashboard/forge"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full border border-glass-border text-white hover:border-glow hover:bg-glass transition-all duration-300"
              >
                Explore Features
              </Link>
            </motion.div>
          </div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <GlassCard className="p-0 overflow-hidden">
              <div className="relative p-8 md:p-10 bg-deep">
                <div className="absolute top-4 right-4 flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-void border border-glass-border" />
                  <div className="w-2.5 h-2.5 rounded-full bg-glass" />
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-text-muted tracking-wide uppercase">Profession</label>
                    <div className="flex gap-2 flex-wrap">
                      {["Legal", "Marketing", "Engineering"].map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-glass border border-glass-border text-xs text-text-secondary">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-text-muted tracking-wide uppercase">Your Raw Idea</label>
                    <div className="p-4 rounded-2xl bg-surface border border-glass-border text-text-secondary text-sm leading-relaxed font-mono">
                      Write an email about the new policy
                    </div>
                  </div>
                  <div className="pt-4 border-t border-glass-border">
                    <div className="flex items-center gap-3 mb-3">
                      <Sparkles className="w-4 h-4 text-text-muted" />
                      <span className="text-xs font-medium text-text-muted tracking-wide">FORGED OUTPUT</span>
                    </div>
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-surface to-deep border border-glass-border">
                      <h4 className="font-serif text-2xl mb-3">Policy Announcement Email</h4>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        <span className="text-text-primary font-medium">Role:</span> Senior Internal Communications Manager.<br />
                        <span className="text-text-primary font-medium">Context:</span> Announce a new remote-work policy to 500+ employees with clarity and empathy.<br />
                        <span className="text-text-primary font-medium">Task:</span> Draft an email that explains the change, addresses common concerns, outlines the timeline, and invites feedback through a designated portal.<br />
                        <span className="text-text-primary font-medium">Format:</span> Professional, concise, structured with bullet points, ending with a clear call-to-action.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* Features */}
        <section id="features" className="mb-24 md:mb-48">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl mb-4 md:mb-6">Built for precision.</h2>
            <p className="text-text-secondary text-base sm:text-xl max-w-xl mx-auto">Every interaction is engineered for speed, beauty, and absolute control over your AI outputs.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Cinematic Design", desc: "Glassmorphism, noise textures, and spring-animated interactions that feel like a native OS app.", icon: Shield },
              { title: "AI Forge Engine", desc: "Multi-stage transformation framework that converts vague ideas into professional-grade prompts.", icon: Sparkles },
              { title: "Command Center", desc: "Keyboard-first navigation with ⌘K search, instant history retrieval, and one-click actions.", icon: Zap },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
              >
                <GlassCard hover={true} className="p-8 h-full">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-void to-surface border border-glass-border flex items-center justify-center mb-6 shadow-inner">
                    <feat.icon className="w-6 h-6 text-text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feat.title}</h3>
                  <p className="text-text-secondary leading-relaxed text-sm">{feat.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it Works */}
        <section className="mb-24 md:mb-48">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-center mb-10 md:mb-16">How it works.</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Select Domain", desc: "Choose from 12+ professional categories or define your own." },
              { num: "02", title: "Enter Raw Idea", desc: "Type your rough concept, no special formatting required." },
              { num: "03", title: "Forge Prompt", desc: "Our engine transforms it into a structured, high-impact prompt." },
              { num: "04", title: "Refine & Save", desc: "Copy, save, favorite, or iterate further with one click." },
            ].map((step, i) => (
              <div key={step.num} className="relative group">
                <div className="text-6xl font-serif text-steel opacity-20 mb-4">{step.num}</div>
                <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
                <p className="text-sm text-text-secondary">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Teaser */}
        <section id="pricing" className="max-w-3xl mx-auto text-center mb-20 md:mb-32">
          <GlassCard className="p-6 sm:p-12">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-4 md:mb-6">Start Free. Scale as you grow.</h2>
            <p className="text-text-secondary text-base sm:text-lg mb-8">Unlimited generations with the core engine. Pro unlocks history, favorites, multi-language, and team collaboration.</p>
            <a href="/en/dashboard/forge" className="inline-block bg-white text-void px-10 py-4 rounded-full font-bold text-lg hover:bg-[#f0f0f0] shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all hover:-translate-y-1">Get Started for Free</a>
          </GlassCard>
        </section>

        {/* Footer */}
        <footer className="border-t border-glass-border pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-text-muted text-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold text-text-primary">PromptForge</span>
            <span>— Built for precision.</span>
          </div>
          <p>© 2026 PromptForge. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
