"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { TESTS } from "@/lib/data/tests";
import { ArrowRight, Lock, TrendingUp, Globe, Zap, Shield, CheckCircle, XCircle } from "lucide-react";

// ═══════════════════════════════════════════════════════
// PROBLEM SECTION
// ═══════════════════════════════════════════════════════
export function ProblemSection() {
  const problems = [
    { icon: <XCircle className="h-5 w-5 text-red-400" />, title: "CVs can't be trusted", desc: "46% of CVs in 2026 contain AI-generated or exaggerated content. There is no trustless way to verify claimed skills." },
    { icon: <XCircle className="h-5 w-5 text-red-400" />, title: "Background checks cost a fortune", desc: "Companies spend $50–200 per candidate just to confirm basic claims. For 1,000 applicants, that's $150,000 wasted." },
    { icon: <XCircle className="h-5 w-5 text-red-400" />, title: "Candidates give up privacy to apply", desc: "Every job application forces candidates to expose name, phone, address, and salary — before any relationship is formed." },
    { icon: <XCircle className="h-5 w-5 text-red-400" />, title: "Geography kills equal opportunity", desc: "A developer in Seoul with top 5% cognitive ability has no way to prove it to a company in Amsterdam. Credentials don't travel." },
  ];

  return (
    <section className="py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-16"
        >
          <p className="text-xs font-mono font-medium text-red-400 uppercase tracking-widest mb-4">
            The Problem
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-hi mb-4">
            Hiring is broken at the foundation.
          </h2>
          <p className="text-mid text-lg leading-relaxed">
            The entire industry is built on trust signals that are increasingly unreliable, expensive to verify, and fundamentally invasive to candidates.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {problems.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-4 p-5 bg-surface border border-border rounded-xl"
            >
              <div className="mt-0.5">{p.icon}</div>
              <div>
                <h3 className="font-display font-semibold text-hi mb-1.5">{p.title}</h3>
                <p className="text-mid text-sm leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Transition */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-8 bg-brand-dim border border-brand/15 rounded-2xl text-center"
        >
          <p className="font-display text-2xl font-bold text-hi mb-2">COGNIFY fixes all of this.</p>
          <p className="text-mid">One platform. Trustless verification. Zero compromise on privacy.</p>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
// HOW IT WORKS
// ═══════════════════════════════════════════════════════
export function HowItWorksSection() {
  const steps = [
    {
      n: "01", icon: <Zap className="h-5 w-5" />, color: "brand",
      title: "Take a validated cognitive assessment",
      desc: "Our tests are calibrated against standardized psychometric norms. They measure real cognitive ability — memory, logic, and numerical speed — that cannot be faked or AI-generated.",
      detail: "No email. No CV. Just connect your wallet and begin.",
    },
    {
      n: "02", icon: <Lock className="h-5 w-5" />, color: "secure",
      title: "Your score is encrypted on COTI Network",
      desc: "COTI's native on-chain encryption means your exact score (e.g. 94/100) is stored as an encrypted value that only your wallet can decrypt. Not us. Not anyone.",
      detail: "This is impossible on Ethereum, Solana, or any other public blockchain.",
    },
    {
      n: "03", icon: <Shield className="h-5 w-5" />, color: "brand",
      title: "Receive your SkillProof Badge",
      desc: "A tamper-proof badge is minted to your wallet. It carries your tier (Bronze/Silver/Gold), global percentile, and on-chain proof — publicly visible, cryptographically unfakeable.",
      detail: "One badge stays with you forever, across every job application.",
    },
    {
      n: "04", icon: <TrendingUp className="h-5 w-5" />, color: "secure",
      title: "You control every disclosure, per employer",
      desc: "Share a verification link. Set disclosure per company: tier only for cold applications, full report for final-round interviews. Grant or revoke access anytime.",
      detail: "Recruiters verify instantly — no account, no subscription, no cost.",
    },
  ];

  const colorMap: Record<string, string> = {
    brand:  "bg-brand-dim border-brand/15 text-brand-light",
    secure: "bg-secure-dim border-secure/15 text-secure-light",
  };

  return (
    <section id="how-it-works" className="py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-16"
        >
          <p className="text-xs font-mono font-medium text-brand-light uppercase tracking-widest mb-4">
            How It Works
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-hi mb-4">
            From test to verified credential in minutes.
          </h2>
          <p className="text-mid text-lg leading-relaxed">
            Four steps. Entirely on-chain. Fully under your control.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-6 bg-surface border border-border rounded-2xl overflow-hidden group hover:border-borderlt transition-colors"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-2 rounded-lg border ${colorMap[s.color]}`}>
                  {s.icon}
                </div>
                <span className="font-mono text-xs text-lo mt-2">{s.n}</span>
              </div>
              <h3 className="font-display font-bold text-lg text-hi mb-2">{s.title}</h3>
              <p className="text-mid text-sm leading-relaxed mb-3">{s.desc}</p>
              <p className="text-xs text-lo font-mono border-t border-border pt-3 mt-3">{s.detail}</p>
            </motion.div>
          ))}
        </div>

        {/* Disclosure model */}
        <DisclosureModel />
      </div>
    </section>
  );
}

function DisclosureModel() {
  const rows = [
    { level: "Tier only",         pub: true,  part: true,  full: true,  desc: "Gold / Silver / Bronze badge" },
    { level: "Global percentile", pub: true,  part: true,  full: true,  desc: "\"Top 6% of 18,200 takers\"" },
    { level: "Exact score",       pub: false, part: true,  full: true,  desc: "Numerical score (e.g. 94/100)" },
    { level: "Time taken",        pub: false, part: false, full: true,  desc: "Completion time per section" },
    { level: "Accuracy breakdown",pub: false, part: false, full: true,  desc: "Question-level performance" },
    { level: "Industry benchmark",pub: false, part: false, full: true,  desc: "vs. Software Engineers, etc." },
    { level: "Your identity",     pub: false, part: false, full: false, desc: "Never stored or revealed" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-12 bg-surface border border-border rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-border">
        <h3 className="font-display font-bold text-hi text-lg">Disclosure levels — you choose per employer</h3>
        <p className="text-mid text-sm mt-1">Control exactly what each company sees. Change or revoke anytime.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-3 text-[11px] font-mono text-lo uppercase tracking-wider">Data field</th>
              <th className="text-center px-4 py-3 text-[11px] font-mono text-lo uppercase tracking-wider">Tier only</th>
              <th className="text-center px-4 py-3 text-[11px] font-mono text-lo uppercase tracking-wider">+ Score</th>
              <th className="text-center px-4 py-3 text-[11px] font-mono text-lo uppercase tracking-wider">Full report</th>
              <th className="text-left px-6 py-3 text-[11px] font-mono text-lo uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-raised/30"}`}>
                <td className="px-6 py-3 text-sm text-mid font-medium">{r.level}</td>
                <td className="text-center px-4 py-3">
                  {r.pub ? <CheckCircle className="h-4 w-4 text-success mx-auto" /> : <div className="h-4 w-4 rounded bg-raised mx-auto" />}
                </td>
                <td className="text-center px-4 py-3">
                  {r.part ? <CheckCircle className="h-4 w-4 text-success mx-auto" /> : <div className="h-4 w-4 rounded bg-raised mx-auto" />}
                </td>
                <td className="text-center px-4 py-3">
                  {r.full ? <CheckCircle className="h-4 w-4 text-success mx-auto" /> : <XCircle className="h-4 w-4 text-red-500 mx-auto" />}
                </td>
                <td className="px-6 py-3 text-sm text-lo">{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// ASSESSMENTS SECTION
// ═══════════════════════════════════════════════════════
export function AssessmentsSection() {
  const colorMap: Record<string, { ring: string; text: string; bg: string }> = {
    brand:  { ring: "group-hover:border-brand/40 group-hover:shadow-brand", text: "text-brand-light", bg: "bg-brand-dim" },
    secure: { ring: "group-hover:border-secure/40 group-hover:shadow-secure", text: "text-secure-light", bg: "bg-secure-dim" },
    gold:   { ring: "group-hover:border-yellow-500/40", text: "text-yellow-400", bg: "bg-yellow-500/10" },
  };

  return (
    <section id="assessments" className="py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <p className="text-xs font-mono font-medium text-brand-light uppercase tracking-widest mb-4">Assessments</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-hi mb-3">
              Prove what you can do.
            </h2>
            <p className="text-mid text-lg max-w-lg">
              Validated cognitive tests. Real-world benchmarks. On-chain results.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-lo">
            <Globe className="h-4 w-4" />
            <span>Taken by 127,400+ candidates globally</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TESTS.map((test, i) => {
            const c = colorMap[test.color];
            return (
              <motion.div
                key={test.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09 }}
              >
                {test.available ? (
                  <Link href={`/test/${test.slug}`}>
                    <AssessmentCard test={test} c={c} />
                  </Link>
                ) : (
                  <AssessmentCard test={test} c={c} locked />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Benchmark preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 p-6 bg-surface border border-border rounded-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="font-display font-bold text-hi">Industry benchmarks included</h3>
              <p className="text-mid text-sm">See how you compare to professionals in your target role.</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { role: "Software Engineer",  score: 74, yours: 94 },
              { role: "Data Scientist",     score: 79, yours: 94 },
              { role: "Finance Analyst",    score: 72, yours: 94 },
              { role: "General Population", score: 58, yours: 94 },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-36 text-sm text-mid flex-shrink-0">{b.role}</div>
                <div className="flex-1 h-2 bg-raised rounded-full overflow-hidden relative">
                  <div className="absolute inset-y-0 left-0 bg-border rounded-full" style={{ width: `${b.score}%` }} />
                  <div className="absolute inset-y-0 left-0 bg-brand rounded-full opacity-70" style={{ width: `${b.yours}%` }} />
                </div>
                <div className="text-sm font-mono text-mid w-20 text-right">
                  <span className="text-hi">{b.yours}</span>
                  <span className="text-lo"> vs {b.score}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-lo mt-4 font-mono">Blue = your score · Gray = industry average · Memory Sequence example</p>
        </motion.div>
      </div>
    </section>
  );
}

function AssessmentCard({ test, c, locked }: { test: any; c: any; locked?: boolean }) {
  return (
    <div className={`group relative h-full bg-surface border border-border rounded-2xl p-5 flex flex-col
      transition-all duration-300 ${locked ? "opacity-50" : `cursor-pointer hover:-translate-y-1 ${c.ring}`}`}
    >
      {locked && (
        <div className="absolute top-4 right-4 px-2 py-0.5 rounded bg-raised border border-border text-[10px] font-mono text-lo">
          Coming soon
        </div>
      )}

      <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center text-xl mb-4 font-mono`}>
        {test.icon}
      </div>

      <p className={`text-[11px] font-mono font-medium uppercase tracking-wider mb-1 ${c.text}`}>{test.subtitle}</p>
      <h3 className="font-display font-bold text-hi text-[17px] mb-2">{test.title}</h3>
      <p className="text-mid text-sm leading-relaxed flex-1">{test.description}</p>

      <div className="mt-5 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-lo">{test.duration}s · {(test.totalTakers / 1000).toFixed(0)}k takers</span>
          {!locked && (
            <span className={`flex items-center gap-1 text-xs font-medium ${c.text}`}>
              Start <ArrowRight className="h-3 w-3" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {[
            { tier: "B", reward: test.rewards.bronze },
            { tier: "S", reward: test.rewards.silver },
            { tier: "G", reward: test.rewards.gold },
          ].map((r) => (
            <div key={r.tier} className="flex items-center gap-1 text-[11px] text-lo">
              <span className="font-mono">{r.tier}:</span>
              <span className="text-mid font-medium">{r.reward} COG</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// TRUST SECTION
// ═══════════════════════════════════════════════════════
export function TrustSection() {
  const useCases = [
    {
      icon: "🎓", title: "Fresh graduates",
      desc: "No work history? Prove your cognitive ability is top 10% globally. That's more credible than a GPA — and costs nothing to verify.",
    },
    {
      icon: "🌏", title: "Emerging market talent",
      desc: "A developer in Singapore or Lagos with a Gold badge speaks in a universal language any company in the world understands instantly.",
    },
    {
      icon: "💼", title: "Freelancers & contractors",
      desc: "Add your verification link to every proposal. Clients pay premium rates for provably top-tier cognitive ability.",
    },
    {
      icon: "🏢", title: "HR teams & recruiters",
      desc: "Screen 1,000 applicants down to 50 using cognitive benchmarks — in minutes, for free, without a single interview.",
    },
    {
      icon: "🤖", title: "The AI résumé era",
      desc: "You cannot fake a timed, real-time cognitive test. In a world of AI-generated CVs, this is the only signal that proves a human showed up.",
    },
    {
      icon: "🔐", title: "Privacy-conscious professionals",
      desc: "Apply to jobs without giving your email, phone, or salary to companies you're not sure about yet. Maintain full control.",
    },
  ];

  return (
    <section className="py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-16"
        >
          <p className="text-xs font-mono font-medium text-secure-light uppercase tracking-widest mb-4">Real-World Value</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-hi mb-4">
            Built for everyone. Useful for life.
          </h2>
          <p className="text-mid text-lg">One assessment. One badge. Works everywhere, forever.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {useCases.map((u, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="p-5 bg-surface border border-border rounded-xl hover:border-borderlt transition-colors"
            >
              <div className="text-2xl mb-3">{u.icon}</div>
              <h3 className="font-display font-bold text-hi mb-2">{u.title}</h3>
              <p className="text-mid text-sm leading-relaxed">{u.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Why COTI box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 bg-secure-dim border border-secure/20 rounded-2xl"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-secure/20 flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-secure-light" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-hi mb-1">Why this only works on COTI</h3>
              <p className="text-mid text-sm">COGNIFY requires a blockchain that can store encrypted data natively. Only COTI can do this.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Ethereum / Solana", desc: "All on-chain data is public. Storing a private score requires ZK-SNARKs — months of dev work, expensive audits.", bad: true },
              { title: "Centralized DB",    desc: "A database can be hacked, sold, or subpoenaed. Not trustless. Candidates must trust the company.", bad: true },
              { title: "COTI Network",      desc: "Native MPC encryption at the protocol level. One encrypted storage slot = private score. No ZK required.", bad: false },
            ].map((c, i) => (
              <div key={i} className={`p-4 rounded-xl border ${c.bad ? "border-red-500/20 bg-red-500/5" : "border-secure/30 bg-secure/10"}`}>
                <p className={`font-medium text-sm mb-1.5 ${c.bad ? "text-red-400" : "text-secure-light"}`}>
                  {c.bad ? "✗" : "✓"} {c.title}
                </p>
                <p className="text-mid text-xs leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════
export function FooterSection() {
  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
              <Shield className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-display font-bold">
              <span className="grad-brand">COGNI</span>
              <span className="text-hi">FY</span>
            </span>
            <span className="text-xs text-lo">— Skill verification infrastructure</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-lo">
            <Link href="/#assessments" className="hover:text-mid transition-colors">Assessments</Link>
            <Link href="/verify" className="hover:text-mid transition-colors">Verify</Link>
            <a href="https://docs.coti.io" target="_blank" rel="noopener noreferrer" className="hover:text-mid transition-colors">COTI Docs</a>
            <a href="https://stay.coti.io/vibe-coding" target="_blank" rel="noopener noreferrer" className="hover:text-mid transition-colors">Vibe Code Challenge</a>
          </div>
          <p className="text-xs text-lo font-mono">© 2026 COGNIFY · COTI Network</p>
        </div>
      </div>
    </footer>
  );
}
