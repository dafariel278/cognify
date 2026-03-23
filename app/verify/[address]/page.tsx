"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle, ArrowRight, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { BadgeCard } from "@/components/passport/BadgeCard";
import { getBadges, resolveDisclosure } from "@/lib/data/storage";
import { BadgeRecord } from "@/lib/types";
import { shortAddr } from "@/lib/utils";

export default function VerifyPage() {
  const params  = useParams();
  const address = params?.address as string;
  const [badges, setBadges] = useState<BadgeRecord[]>([]);
  const isValid = /^0x[a-fA-F0-9]{40}$/.test(address);

  useEffect(() => {
    if (isValid) setBadges(getBadges(address));
  }, [address, isValid]);

  if (!isValid) return (
    <main className="min-h-screen bg-base dot-grid">
      <Navbar />
      <div className="flex items-center justify-center min-h-[70vh] pt-16">
        <div className="text-center">
          <p className="text-4xl mb-4">❌</p>
          <h2 className="font-display text-2xl font-bold text-hi mb-2">Invalid address</h2>
          <Link href="/" className="text-brand-light hover:underline text-sm">← Go home</Link>
        </div>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-base dot-grid">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-24 pb-16">
        <Link href="/" className="inline-flex items-center gap-2 text-lo hover:text-mid text-sm mb-8 transition-colors">
          <Shield className="h-4 w-4" /> COGNIFY
        </Link>

        {/* Verification header */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          className="mb-8 p-6 bg-surface border border-secure/20 rounded-2xl"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-secure-dim border border-secure/20 flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-secure-light" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="font-display font-bold text-xl text-hi">SkillProof Verification</h1>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-success/10 border border-success/20">
                  <CheckCircle className="h-3.5 w-3.5 text-success" />
                  <span className="text-xs font-mono font-semibold text-success">Authentic</span>
                </div>
              </div>
              <p className="text-mid text-sm leading-relaxed mb-2">
                This profile is verified by <span className="text-hi font-medium">COGNIFY</span> on COTI Network.
                All badges are cryptographically proven and tamper-proof.
              </p>
              <p className="text-xs font-mono text-lo">Wallet: <span className="text-mid">{address}</span></p>
            </div>
          </div>
        </motion.div>

        {/* Privacy statement */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }}
          className="mb-8 flex items-start gap-3 p-4 bg-brand-dim border border-brand/15 rounded-xl"
        >
          <Shield className="h-4 w-4 text-brand-light mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-hi mb-0.5">Privacy-first verification</p>
            <p className="text-xs text-mid leading-relaxed">
              Exact scores are encrypted on COTI Network and never visible here — not even to us.
              The candidate controls what you see. Badges are cryptographically unforgeable.
            </p>
          </div>
        </motion.div>

        {/* Badges */}
        {badges.length === 0 ? (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.15 }}
            className="text-center py-16 bg-surface border border-border rounded-2xl"
          >
            <p className="text-3xl mb-3">🏅</p>
            <p className="font-display font-bold text-hi mb-2">No badges found</p>
            <p className="text-mid text-sm">This wallet hasn't earned any SkillProof Badges yet.</p>
          </motion.div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-hi">{badges.length} verified badge{badges.length !== 1 ? "s" : ""}</p>
              <p className="text-xs text-lo font-mono">{shortAddr(address)}</p>
            </div>

            {badges.map((badge, i) => {
              const level = resolveDisclosure(badge, "public");
              return (
                <motion.div key={badge.id}
                  initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  <BadgeCard badge={badge} level={level} showPrivate={false} />

                  {/* Interpretation */}
                  <div className="mt-2 px-4 py-3 bg-raised border border-border rounded-xl">
                    <p className="text-xs text-mid leading-relaxed">
                      <span className="text-hi font-medium">What this means: </span>
                      {badge.tier === "gold"   && `Exceptional performance — top ${badge.percentile}% globally. Consistent Gold performers match characteristics of high-performing professionals in cognitively demanding roles.`}
                      {badge.tier === "silver" && `Strong cognitive ability — top ${badge.percentile}% globally. Silver performers consistently outperform the general population and meet benchmarks for most professional roles.`}
                      {badge.tier === "bronze" && `Competent — demonstrated satisfactory ability above the ${badge.percentile}th percentile. Meets the baseline cognitive threshold for entry-level positions.`}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Recruiter CTA */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
          className="mt-10 p-6 bg-surface border border-border rounded-2xl text-center"
        >
          <p className="font-display font-bold text-hi mb-2">Verify your own skills?</p>
          <p className="text-mid text-sm mb-4">Take our cognitive assessments and build a tamper-proof skill profile.</p>
          <Link href="/#assessments"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand text-white font-medium shadow-brand hover:bg-brand-dark transition-all">
            Start Assessment <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
