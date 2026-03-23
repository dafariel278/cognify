"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Copy, CheckCircle, ArrowRight, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { BadgeCard } from "@/components/passport/BadgeCard";
import { ConsentPanel } from "@/components/passport/ConsentPanel";
import { useWallet } from "@/context/WalletContext";
import { getBadges } from "@/lib/data/storage";
import { BadgeRecord } from "@/lib/types";
import { TESTS } from "@/lib/data/tests";
import { shortAddr } from "@/lib/utils";

export default function PassportPage() {
  const { address, isConnected, connect } = useWallet();
  const [badges,  setBadges]  = useState<BadgeRecord[]>([]);
  const [copied,  setCopied]  = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (address) setBadges(getBadges(address));
  }, [address]);

  const verifyUrl = address ? `${typeof window !== "undefined" ? window.location.origin : "https://cognify.app"}/verify/${address}` : "";
  const totalCOG  = badges.reduce((s, b) => s + b.reward, 0);

  const copy = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  };

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-base dot-grid">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] pt-16">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            className="text-center max-w-sm px-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-brand-dim border border-brand/20 flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-brand-light" />
            </div>
            <h2 className="font-display text-2xl font-bold text-hi mb-3">Your Skill Passport</h2>
            <p className="text-mid mb-6 leading-relaxed">Connect your wallet to view your verified skill badges and manage disclosure settings.</p>
            <button onClick={connect}
              className="px-7 py-3 rounded-lg bg-brand text-white font-medium shadow-brand hover:bg-brand-dark transition-all">
              Connect Wallet
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  const availableTests = TESTS.filter(t => t.available && !badges.find(b => b.testSlug === t.slug));

  return (
    <main className="min-h-screen bg-base dot-grid">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        {/* Page header */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10"
        >
          <div>
            <p className="text-xs font-mono text-lo uppercase tracking-widest mb-2">Skill Passport</p>
            <h1 className="font-display text-3xl font-bold text-hi">{shortAddr(address!)}</h1>
            <p className="text-mid text-sm mt-1">{badges.length} badge{badges.length !== 1 ? "s" : ""} earned · {totalCOG} COG total</p>
          </div>
          {badges.length > 0 && (
            <button onClick={copy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-surface text-sm text-mid hover:border-borderlt hover:text-hi transition-all"
            >
              {copied ? <><CheckCircle className="h-4 w-4 text-success" />Copied!</> : <><Copy className="h-4 w-4" />Copy Verify Link</>}
            </button>
          )}
        </motion.div>

        {badges.length === 0 ? (
          /* Empty state */
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            className="text-center py-20 bg-surface border border-border rounded-2xl"
          >
            <div className="text-5xl mb-4">🏅</div>
            <h3 className="font-display text-xl font-bold text-hi mb-2">No badges yet</h3>
            <p className="text-mid mb-6">Take your first cognitive assessment to earn a SkillProof Badge.</p>
            <Link href="/#assessments"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand text-white font-medium shadow-brand hover:bg-brand-dark transition-all">
              Take an Assessment <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Verification link card */}
            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              className="p-5 bg-surface border border-secure/20 rounded-2xl"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-secure-dim border border-secure/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-4.5 w-4.5 text-secure-light" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-hi mb-1">Your verification link</p>
                  <p className="text-mid text-sm mb-3">Share this with employers. They verify your badges instantly — free, no account needed.</p>
                  <div className="flex items-center gap-2 px-3 py-2 bg-raised border border-border rounded-lg">
                    <span className="text-xs font-mono text-lo truncate flex-1">{verifyUrl}</span>
                    <button onClick={copy} className="text-lo hover:text-secure-light transition-colors flex-shrink-0">
                      {copied ? <CheckCircle className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Badges with consent control */}
            <div>
              <p className="text-xs font-mono text-lo uppercase tracking-wider mb-4">Your badges</p>
              <div className="space-y-4">
                {badges.map((badge, i) => (
                  <motion.div key={badge.id}
                    initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <BadgeCard badge={badge} level="full" showPrivate />

                    {/* Consent control toggle */}
                    <div className="mt-2">
                      <button
                        onClick={() => setExpanded(expanded === badge.id ? null : badge.id)}
                        className="w-full flex items-center justify-between px-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-mid hover:border-borderlt hover:text-hi transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Manage disclosure settings
                        </div>
                        {expanded === badge.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>

                      <AnimatePresence>
                        {expanded === badge.id && (
                          <motion.div
                            initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
                            exit={{ opacity:0, height:0 }} transition={{ duration:0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 p-5 bg-surface border border-border rounded-xl">
                              <ConsentPanel badge={badge} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Earn more */}
            {availableTests.length > 0 && (
              <div>
                <p className="text-xs font-mono text-lo uppercase tracking-wider mb-4">Earn more badges</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {availableTests.map(t => (
                    <Link key={t.slug} href={`/test/${t.slug}`}
                      className="group flex items-center gap-3 p-4 bg-surface border border-border rounded-xl hover:border-brand/30 hover:-translate-y-0.5 transition-all"
                    >
                      <span className="text-xl">{t.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-hi text-sm">{t.title}</p>
                        <p className="text-xs text-lo">Up to {t.rewards.gold} COG</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-lo group-hover:text-brand-light group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
