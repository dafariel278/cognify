"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, ExternalLink, ChevronRight } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

const BADGES_PREVIEW = [
  { title:"Memory Sequence", tier:"Gold",   score:"94", percentile:"Top 6%",  color:"gold",   tx:"0xa3f1…c88d" },
  { title:"Pattern Logic",   tier:"Silver", score:"78", percentile:"Top 22%", color:"silver", tx:"0xb72e…f14a" },
  { title:"Speed Math",      tier:"Gold",   score:"91", percentile:"Top 9%",  color:"gold",   tx:"0xc91d…a33b" },
];

const TIER_STYLES: Record<string, string> = {
  gold:   "border-yellow-500/30 bg-yellow-500/5 text-yellow-400",
  silver: "border-slate-400/30 bg-slate-400/5 text-slate-300",
  bronze: "border-orange-600/30 bg-orange-600/5 text-orange-400",
};

export function HeroSection() {
  const { isConnected, address, connect } = useWallet();
  const displayAddr = address ? (address.slice(0,6) + "..." + address.slice(-4)) : null;
  

  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      {/* Ambient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-brand/8 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-secure/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                border border-brand/20 bg-brand-dim text-brand-light text-xs font-medium mb-8"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-brand-light animate-pulse" />
              Built on COTI Network · Privacy-First
              <ChevronRight className="h-3 w-3" />
            </motion.div>

            {/* Headline */}
            <div className="overflow-hidden mb-3">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.18, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-5xl md:text-[60px] lg:text-[68px] font-bold
                  leading-[1.02] tracking-[-0.03em] text-hi"
              >
                Your skills,
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-3">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.26, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-5xl md:text-[60px] lg:text-[68px] font-bold
                  leading-[1.02] tracking-[-0.03em] grad-brand"
              >
                verified forever.
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-8">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.34, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-5xl md:text-[60px] lg:text-[68px] font-bold
                  leading-[1.02] tracking-[-0.03em] text-hi"
              >
                On-chain.
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-mid leading-relaxed max-w-[500px] mb-10"
            >
              Take validated cognitive assessments. Earn tamper-proof SkillProof Badges on COTI.
              You decide exactly how much each employer sees — from tier only to full report.
              No CV. No middleman. No compromise.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62 }}
              className="flex flex-wrap gap-3"
            >
              <Link href="/#assessments"
                className="group flex items-center gap-2 px-6 py-3 rounded-lg
                  bg-brand text-white font-medium shadow-brand
                  hover:bg-brand-dark hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(99,102,241,0.35)]
                  transition-all duration-200"
              >
                Take an Assessment
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/verify"
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border
                  text-mid font-medium hover:border-borderlt hover:text-hi hover:bg-raised transition-all"
              >
                <ExternalLink className="h-4 w-4" />
                Verify a Candidate
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-border"
            >
              {[
                { val: "48,200+", label: "Assessments taken" },
                { val: "3 tests",  label: "Active skill tracks" },
                { val: "$0",       label: "Verification cost" },
              ].map((s, i) => (
                <div key={i}>
                  <p className="font-display text-xl font-bold text-hi">{s.val}</p>
                  <p className="text-sm text-lo">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Passport preview */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <PassportPreview displayAddr={displayAddr || ""} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PassportPreview({ displayAddr }: { displayAddr: string | null }) {
  return (
    <div className="relative">
      {/* Glow */}
      <div className="absolute inset-0 bg-brand/8 blur-[60px] rounded-3xl" />

      {/* Passport card */}
      <div className="relative bg-surface border border-border rounded-2xl p-6 shadow-card shine scanline">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-display font-bold text-hi tracking-tight">COGNIFY</p>
              <p className="text-[10px] text-lo font-mono">Skill Passport</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md
            bg-secure-dim border border-secure/20 text-[11px] font-medium text-secure-light">
            <div className="w-1.5 h-1.5 rounded-full bg-secure-light animate-pulse" />
            COTI Network
          </div>
        </div>

        {/* Wallet */}
        <div className="flex items-center gap-2 mb-5 px-3 py-2 bg-raised rounded-lg border border-border">
          <div className="w-6 h-6 rounded-md bg-brand-dim flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-brand-light" />
          </div>
          <span className="font-mono text-[11px] text-mid">{displayAddr || "Connect your wallet"}</span>
          <div className={`ml-auto flex items-center gap-1 text-[10px] ${displayAddr ? "text-success" : "text-lo"}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${displayAddr ? "bg-success animate-pulse" : "bg-lo"}`} />
            {displayAddr ? "Connected" : "Not connected"}
          </div>
        </div>

        {/* Badges */}
        <div className="space-y-3">
          {BADGES_PREVIEW.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.12 }}
              className={`flex items-center justify-between p-3 rounded-xl border ${TIER_STYLES[b.color]}`}
            >
              <div>
                <p className="text-[11px] text-lo mb-0.5">{b.title}</p>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-sm">{b.tier}</span>
                  <span className="text-[10px] text-lo font-mono">{b.percentile}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="w-8 h-8 rounded-lg border border-current/20 bg-current/5
                  flex items-center justify-center font-display font-bold text-sm">
                  {b.tier[0]}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Disclosure note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-4 flex items-center gap-2 px-3 py-2 bg-brand-dim border border-brand/15 rounded-lg"
        >
          <Shield className="h-3.5 w-3.5 text-brand-light flex-shrink-0" />
          <p className="text-[11px] text-mid">
            <span className="text-brand-light font-medium">You control disclosure.</span>
            {" "}Each employer sees only what you allow.
          </p>
        </motion.div>
      </div>

      {/* Floating access request card */}
      <motion.div
        initial={{ opacity: 0, y: 16, x: 16 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute -bottom-6 -right-6 bg-overlay border border-border rounded-xl p-4 shadow-card w-52"
      >
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-md bg-brand-dim flex-shrink-0 flex items-center justify-center mt-0.5">
            <span className="text-[10px] font-bold text-brand-light">G</span>
          </div>
          <div>
            <p className="text-[11px] font-medium text-hi mb-0.5">TechCorp Global</p>
            <p className="text-[10px] text-lo">Requested full score access</p>
            <div className="flex gap-1.5 mt-2">
              <button className="px-2 py-0.5 rounded text-[10px] bg-brand text-white font-medium">Grant</button>
              <button className="px-2 py-0.5 rounded text-[10px] border border-border text-lo">Decline</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
