"use client";
import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Users, Shield, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { MemorySequenceTest } from "@/components/tests/MemorySequence";
import { PatternLogicTest } from "@/components/tests/PatternLogic";
import { SpeedMathTest } from "@/components/tests/SpeedMath";
import { MintResult } from "@/components/tests/MintResult";
import { getTest } from "@/lib/data/tests";
import { BadgeRecord, TIER_META } from "@/lib/types";

type Phase = "intro" | "testing" | "result";

export default function TestPage() {
  const params = useParams();
  const test   = getTest(params?.slug as string);
  if (!test) return notFound();

  const [phase,     setPhase]     = useState<Phase>("intro");
  const [score,     setScore]     = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [accuracy,  setAccuracy]  = useState(0);
  const [earnedBadge, setEarnedBadge] = useState<BadgeRecord | null>(null);

  if (!test.available) return (
    <main className="min-h-screen bg-base dot-grid">
      <Navbar />
      <div className="flex items-center justify-center min-h-[70vh] pt-16">
        <div className="text-center">
          <p className="text-5xl mb-4">🔒</p>
          <h2 className="font-display text-2xl font-bold text-hi mb-2">Coming Soon</h2>
          <Link href="/" className="text-brand-light hover:underline text-sm">← Back to home</Link>
        </div>
      </div>
    </main>
  );

  const handleComplete = (s: number, t: number, a: number) => {
    setScore(s); setTimeTaken(t); setAccuracy(a); setPhase("result");
  };

  const handleRetry = () => { setPhase("intro"); setScore(0); setTimeTaken(0); setAccuracy(0); };

  const colorMap: Record<string, { text: string; bg: string; border: string }> = {
    brand:  { text: "text-brand-light",  bg: "bg-brand-dim",  border: "border-brand/20"  },
    secure: { text: "text-secure-light", bg: "bg-secure-dim", border: "border-secure/20" },
    gold:   { text: "text-yellow-400",   bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  };
  const c = colorMap[test.color];

  return (
    <main className="min-h-screen bg-base dot-grid">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-24 pb-16">
        <Link href="/" className="inline-flex items-center gap-2 text-lo hover:text-mid text-sm mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <AnimatePresence mode="wait">
          {/* ─── INTRO ─── */}
          {phase === "intro" && (
            <motion.div key="intro" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }}
              className="space-y-5"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-2">
                <div className={`w-14 h-14 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center text-2xl`}>
                  {test.icon}
                </div>
                <div>
                  <p className={`text-xs font-mono font-medium uppercase tracking-widest mb-0.5 ${c.text}`}>{test.subtitle}</p>
                  <h1 className="font-display text-3xl font-bold text-hi">{test.title}</h1>
                </div>
              </div>

              {/* Description */}
              <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
                <p className="text-mid leading-relaxed">{test.longDesc}</p>
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                  {[
                    { icon: <Clock className="h-4 w-4" />,   label:"Duration",    val:`${test.duration}s` },
                    { icon: <Users className="h-4 w-4" />,   label:"Takers",      val:`${(test.totalTakers/1000).toFixed(0)}k+` },
                    { icon: <Shield className="h-4 w-4" />,  label:"Privacy",     val:"Score encrypted" },
                  ].map((m, i) => (
                    <div key={i} className="text-center">
                      <div className="flex justify-center text-lo mb-1">{m.icon}</div>
                      <p className="text-[10px] text-lo font-mono mb-0.5">{m.label}</p>
                      <p className="text-sm font-medium text-hi">{m.val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tier breakdown */}
              <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-border">
                  <p className="text-xs font-mono text-lo uppercase tracking-wider">Badge tiers & rewards</p>
                </div>
                {([
                  { tier:"gold"  as const, min: test.goldMin,   reward: test.rewards.gold   },
                  { tier:"silver"as const, min: test.silverMin, reward: test.rewards.silver },
                  { tier:"bronze"as const, min: test.bronzeMin, reward: test.rewards.bronze },
                ] as const).map(t => {
                  const m = TIER_META[t.tier];
                  return (
                    <div key={t.tier} className={`flex items-center justify-between px-5 py-3 border-b border-border last:border-0`}>
                      <div className="flex items-center gap-2">
                        <span>{m.emoji}</span>
                        <span className={`font-display font-bold ${m.color}`}>{m.label}</span>
                      </div>
                      <span className="text-sm text-mid font-mono">Score ≥ {t.min}%</span>
                      <span className={`font-mono font-bold ${m.color}`}>+{t.reward} COG</span>
                    </div>
                  );
                })}
              </div>

              {/* Industry benchmarks */}
              <div className="bg-surface border border-border rounded-xl p-5">
                <p className="text-xs font-mono text-lo uppercase tracking-wider mb-4">Industry benchmarks</p>
                <div className="space-y-2.5">
                  {Object.entries(test.industryBenchmark).map(([role, avg]) => (
                    <div key={role} className="flex items-center gap-3">
                      <span className="text-sm text-mid w-36 flex-shrink-0">{role}</span>
                      <div className="flex-1 h-1.5 bg-raised rounded-full overflow-hidden">
                        <div className="h-full bg-border rounded-full" style={{ width:`${avg}%` }} />
                      </div>
                      <span className="text-xs font-mono text-lo w-8 text-right">{avg}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy statement */}
              <div className="flex items-start gap-3 p-4 bg-secure-dim border border-secure/15 rounded-xl">
                <Shield className="h-4 w-4 text-secure-light mt-0.5 flex-shrink-0" />
                <p className="text-sm text-mid leading-relaxed">
                  Your exact score is <span className="text-secure-light font-medium">encrypted on COTI Network</span> using native MPC encryption.
                  Nobody — not us, not COTI — can read it. You control every disclosure.
                </p>
              </div>

              <motion.button
                whileHover={{ scale:1.01, y:-2 }} whileTap={{ scale:0.98 }}
                onClick={() => setPhase("testing")}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl
                  bg-brand text-white font-display font-bold text-lg shadow-brand
                  hover:bg-brand-dark hover:shadow-[0_8px_30px_rgba(99,102,241,0.4)] transition-all"
              >
                Start Assessment <ChevronRight className="h-5 w-5" />
              </motion.button>
            </motion.div>
          )}

          {/* ─── TESTING ─── */}
          {phase === "testing" && (
            <motion.div key="testing" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
              <div className="bg-surface border border-border rounded-2xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6 pb-5 border-b border-border">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{test.icon}</span>
                    <span className="font-display font-bold text-hi">{test.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-dim border border-brand/20 text-xs font-mono text-brand-light">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-light animate-pulse" />
                    LIVE
                  </div>
                </div>
                {test.slug === "memory-sequence" && <MemorySequenceTest onComplete={handleComplete} />}
                {test.slug === "pattern-logic"   && <PatternLogicTest  onComplete={handleComplete} />}
                {test.slug === "speed-math"      && <SpeedMathTest     onComplete={handleComplete} />}
              </div>
            </motion.div>
          )}

          {/* ─── RESULT ─── */}
          {phase === "result" && (
            <motion.div key="result" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
              <MintResult
                test={test as any}
                score={score}
                timeTaken={timeTaken}
                accuracy={accuracy}
                onRetry={handleRetry}
                onDone={badge => { setEarnedBadge(badge); }}
              />
              {earnedBadge && (
                <Link href="/passport"
                  className="flex items-center justify-center gap-2 mt-4 py-3 text-sm text-brand-light hover:text-brand font-medium transition-colors">
                  View in Skill Passport <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
