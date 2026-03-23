"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, XCircle, ExternalLink, ArrowRight, RotateCcw } from "lucide-react";
import { TestDef, TIER_META } from "@/lib/types";
import { getTier, getReward, getPercentile } from "@/lib/data/tests";
import { mintBadgeReward } from "@/lib/actions/mint-badge";
import { saveBadge } from "@/lib/data/storage";
import { BadgeRecord } from "@/lib/types";
import { useWallet } from "@/context/WalletContext";

interface Props {
  test:      TestDef;
  score:     number;
  timeTaken: number;
  accuracy:  number;
  onRetry:   () => void;
  onDone:    (badge: BadgeRecord) => void;
}

type State = "idle" | "minting" | "success" | "error";

export function MintResult({ test, score, timeTaken, accuracy, onRetry, onDone }: Props) {
  const { address, isConnected, connect } = useWallet();
  const [state,   setState]   = useState<State>("idle");
  const [txHash,  setTxHash]  = useState<string | null>(null);
  const [errMsg,  setErrMsg]  = useState<string | null>(null);

  const tier = getTier(score, test as any);
  const passed = tier !== null;

  const mint = async () => {
    if (!address || state !== "idle") return;
    setState("minting");
    const reward = passed ? getReward(tier!, test as any) : 0;
    const result = await mintBadgeReward(address, reward);
    if (result.success && result.txHash) {
      const badge: BadgeRecord = {
        id:           `${test.slug}-${address}-${Date.now()}`,
        testSlug:     test.slug,
        testTitle:    test.title,
        testSubtitle: test.subtitle,
        testIcon:     test.icon,
        tier:         tier!,
        score, percentile: getPercentile(score, test as any),
        timeTaken, accuracy, reward,
        txHash: result.txHash,
        timestamp:  Date.now(),
        walletAddr: address,
      };
      saveBadge(badge);
      setTxHash(result.txHash);
      setState("success");
      onDone(badge);
    } else {
      setErrMsg(result.error || "Transaction failed");
      setState("error");
    }
  };

  const meta = tier ? TIER_META[tier] : null;
  const BAR: Record<string, string> = { gold:"from-yellow-500 to-amber-400", silver:"from-slate-400 to-slate-300", bronze:"from-orange-600 to-amber-600" };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="w-full max-w-md mx-auto space-y-4"
    >
      {/* Result card */}
      <div className={`bg-surface border rounded-2xl overflow-hidden ${meta ? `${meta.border} ${meta.shadow}` : "border-red-500/30"}`}>
        {passed && tier && (
          <div className={`h-0.5 bg-gradient-to-r ${BAR[tier]}`} />
        )}
        <div className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-xs font-mono text-lo mb-1">Assessment result</p>
              <h3 className="font-display font-bold text-xl text-hi">{test.title}</h3>
            </div>
            {passed && meta ? (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${meta.bg} ${meta.border}`}>
                <span className="text-lg">{meta.emoji}</span>
                <span className={`font-display font-bold ${meta.color}`}>{meta.label}</span>
              </div>
            ) : (
              <div className="px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/8">
                <span className="text-red-400 text-sm font-medium">No badge</span>
              </div>
            )}
          </div>

          {/* Score bar */}
          <div className="mb-5">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-mid">Score</span>
              <span className="font-mono font-bold text-hi">{score}<span className="text-lo">/100</span></span>
            </div>
            <div className="h-2.5 bg-raised rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                className={`h-full rounded-full ${passed && tier ? `bg-gradient-to-r ${BAR[tier]}` : "bg-red-500/60"}`}
              />
            </div>
            <div className="flex justify-between text-[11px] text-lo mt-1.5 font-mono">
              <span>Bronze ≥ {(test as any).bronzeMin}%</span>
              <span>Silver ≥ {(test as any).silverMin}%</span>
              <span>Gold ≥ {(test as any).goldMin}%</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "Percentile", val: passed ? `Top ${getPercentile(score, test as any)}%` : "—" },
              { label: "Time",       val: `${Math.floor(timeTaken/60)}m ${timeTaken%60}s` },
              { label: "Accuracy",   val: `${accuracy}%` },
            ].map((s, i) => (
              <div key={i} className="bg-raised rounded-xl p-3 text-center">
                <p className="text-[10px] text-lo font-mono mb-1">{s.label}</p>
                <p className="font-mono font-bold text-hi text-sm">{s.val}</p>
              </div>
            ))}
          </div>

          {/* Privacy note */}
          {passed && (
            <div className="flex items-center gap-2 px-3 py-2 bg-secure-dim border border-secure/15 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-secure-light flex-shrink-0" />
              <p className="text-[11px] text-mid">
                <span className="text-secure-light font-medium">Your exact score is encrypted on COTI.</span>
                {" "}Recruiters see only your tier by default.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action area */}
      {passed ? (
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.div key="idle" initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-3">
              {!isConnected ? (
                <div className="p-4 bg-surface border border-border rounded-xl text-center space-y-3">
                  <p className="text-mid text-sm">Connect wallet to claim your SkillProof Badge</p>
                  <button onClick={connect}
                    className="px-6 py-2.5 rounded-lg bg-brand text-white font-medium shadow-brand hover:bg-brand-dark transition-all">
                    Connect Wallet
                  </button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale:1.01, y:-1 }} whileTap={{ scale:0.98 }}
                  onClick={mint}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl
                    bg-brand text-white font-medium shadow-brand hover:bg-brand-dark hover:shadow-[0_8px_30px_rgba(99,102,241,0.4)] transition-all"
                >
                  <span className="text-lg">{meta?.emoji}</span>
                  Mint SkillProof Badge — +{getReward(tier!, test as any)} COG
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              )}
              <button onClick={onRetry}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-mid text-sm hover:border-borderlt hover:text-hi transition-all">
                <RotateCcw className="h-4 w-4" /> Retake Assessment
              </button>
            </motion.div>
          )}

          {state === "minting" && (
            <motion.div key="minting" initial={{ opacity:0 }} animate={{ opacity:1 }}
              className="flex items-center justify-center gap-3 py-5 bg-surface border border-brand/20 rounded-xl">
              <Loader2 className="h-5 w-5 text-brand-light animate-spin" />
              <span className="text-hi font-medium">Minting on COTI Network…</span>
            </motion.div>
          )}

          {state === "success" && txHash && (
            <motion.div key="success" initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }} className="space-y-3">
              <div className="flex items-center gap-3 py-4 px-5 bg-success/8 border border-success/25 rounded-xl">
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                <div>
                  <p className="font-medium text-hi">Badge minted successfully!</p>
                  <a href={`https://testnet.cotiscan.io/tx/${txHash}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-mono text-lo hover:text-mid mt-0.5">
                    {txHash.slice(0,14)}…{txHash.slice(-8)} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
              <button onClick={onRetry}
                className="w-full py-2.5 rounded-xl border border-border text-mid text-sm hover:text-hi hover:border-borderlt transition-all">
                View in Passport →
              </button>
            </motion.div>
          )}

          {state === "error" && (
            <motion.div key="error" initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-red-500/8 border border-red-500/25 rounded-xl">
                <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{errMsg}</p>
              </div>
              <button onClick={mint}
                className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/8 transition-all">
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 bg-raised border border-border rounded-xl">
            <XCircle className="h-5 w-5 text-lo flex-shrink-0" />
            <p className="text-sm text-mid">Score too low for any badge. Minimum {(test as any).bronzeMin}% required for Bronze.</p>
          </div>
          <motion.button
            whileHover={{ scale:1.01, y:-1 }} onClick={onRetry}
            className="w-full py-3.5 rounded-xl bg-brand text-white font-medium shadow-brand hover:bg-brand-dark transition-all">
            Try Again
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
