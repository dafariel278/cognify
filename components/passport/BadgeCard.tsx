"use client";
import { motion } from "framer-motion";
import { ExternalLink, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import { BadgeRecord, TIER_META, DisclosureLevel } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface Props {
  badge:       BadgeRecord;
  level:       DisclosureLevel;
  showPrivate?: boolean; // owner view
  compact?:    boolean;
}

const BAR_COLORS: Record<string, string> = {
  gold:   "from-yellow-500 to-amber-400",
  silver: "from-slate-400 to-slate-300",
  bronze: "from-orange-600 to-amber-600",
};

export function BadgeCard({ badge, level, showPrivate = false, compact = false }: Props) {
  const meta = TIER_META[badge.tier];
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/verify/${badge.walletAddr}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const showScore      = showPrivate || level === "score" || level === "full";
  const showPercentile = level !== "tier" || showPrivate;
  const showFull       = showPrivate || level === "full";

  return (
    <motion.div
      whileHover={compact ? {} : { y: -2 }}
      className={`relative bg-surface border ${meta.border} rounded-2xl overflow-hidden scanline ${meta.shadow} transition-shadow`}
    >
      {/* Top accent */}
      <div className={`h-0.5 w-full bg-gradient-to-r ${BAR_COLORS[badge.tier]}`} />

      <div className={compact ? "p-4" : "p-6"}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-mono font-medium text-success uppercase tracking-widest">
                Verified On-Chain
              </span>
            </div>
            <p className="text-xs text-lo font-mono">COGNIFY · SkillProof Badge</p>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${meta.bg} ${meta.border}`}>
            <span className="text-base">{meta.emoji}</span>
            <span className={`font-display font-bold text-sm ${meta.color}`}>{meta.label}</span>
          </div>
        </div>

        {/* Test info */}
        <div className="mb-4">
          <h3 className="font-display font-bold text-hi text-lg mb-0.5">{badge.testTitle}</h3>
          <p className="text-lo text-xs font-mono">{badge.testSubtitle}</p>
        </div>

        {/* Score section */}
        <div className="space-y-3 mb-4">
          {showScore ? (
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-mid">Score</span>
                <span className="font-mono font-bold text-hi">{badge.score}<span className="text-lo">/100</span></span>
              </div>
              <div className="h-2 bg-raised rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${badge.score}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                  className={`h-full rounded-full bg-gradient-to-r ${BAR_COLORS[badge.tier]}`}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between py-2 px-3 bg-raised rounded-lg border border-border">
              <span className="text-xs text-mid">Exact score</span>
              <span className="font-mono text-xs text-lo tracking-widest">███ / 100</span>
              <span className="text-[10px] text-lo font-mono italic">encrypted</span>
            </div>
          )}

          {showPercentile && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-mid">Global rank</span>
              <span className="font-mono font-bold text-hi">Top {badge.percentile}%</span>
            </div>
          )}

          {showFull && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-mid">Time taken</span>
                <span className="font-mono text-hi">{Math.floor(badge.timeTaken/60)}m {badge.timeTaken%60}s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-mid">Accuracy</span>
                <span className="font-mono text-hi">{badge.accuracy}%</span>
              </div>
            </>
          )}
        </div>

        {/* Reward */}
        {showPrivate && (
          <div className="flex items-center justify-between py-2.5 px-3 bg-brand-dim border border-brand/15 rounded-lg mb-4">
            <span className="text-xs text-mid">COG Reward</span>
            <span className="font-mono font-bold text-brand-light">+{badge.reward} COG</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-[11px] text-lo">{formatDate(badge.timestamp)}</span>
          <div className="flex items-center gap-2">
            <a href={`https://testnet.cotiscan.io/tx/${badge.txHash}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] font-mono text-lo hover:text-mid transition-colors">
              {badge.txHash.slice(0,8)}…<ExternalLink className="h-3 w-3" />
            </a>
            {showPrivate && (
              <button onClick={copy}
                className="p-1.5 rounded-md hover:bg-raised transition-colors text-lo hover:text-mid">
                {copied ? <CheckCircle className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
