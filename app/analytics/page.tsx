"use client";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { useWallet } from "@/context/WalletContext";
import { getBadges } from "@/lib/data/storage";
import { useEffect, useState } from "react";
import { BadgeRecord } from "@/lib/types";
import { TrendingUp, Brain, Zap, Target, Award } from "lucide-react";
import Link from "next/link";

export default function AnalyticsPage() {
  const { address, isConnected, connect } = useWallet();
  const [badges, setBadges] = useState<BadgeRecord[]>([]);
  useEffect(() => { if(address) setBadges(getBadges(address)); }, [address]);

  const avgScore = badges.length ? Math.round(badges.reduce((s,b)=>s+b.score,0)/badges.length) : 0;
  const totalBRM = badges.reduce((s,b)=>s+b.reward,0);
  const bestBadge = badges.sort((a,b)=>b.score-a.score)[0];

  const INSIGHTS = [
    { icon:<Brain className="h-5 w-5"/>, title:"Cognitive Strength", value: avgScore >= 85 ? "Exceptional" : avgScore >= 70 ? "Strong" : avgScore > 0 ? "Developing" : "No data", color:"text-brand-light", desc: "Based on your average assessment score" },
    { icon:<Zap className="h-5 w-5"/>, title:"Best Skill", value: bestBadge?.testTitle || "—", color:"text-yellow-400", desc: `Score: ${bestBadge?.score || 0}/100` },
    { icon:<Target className="h-5 w-5"/>, title:"Global Rank", value: avgScore >= 90 ? "Top 10%" : avgScore >= 80 ? "Top 25%" : avgScore > 0 ? "Top 50%" : "—", color:"text-secure-light", desc:"Compared to all COGNIFY users" },
    { icon:<Award className="h-5 w-5"/>, title:"Total Earned", value:`${totalBRM} COG`, color:"text-violet-400", desc:"From verified assessments" },
  ];

  if (!isConnected) return (
    <main className="min-h-screen bg-base dot-grid">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] pt-16">
        <div className="text-center max-w-sm px-6">
          <TrendingUp className="h-16 w-16 text-lo mx-auto mb-4"/>
          <h2 className="font-display text-2xl font-bold text-hi mb-3">Skill Analytics</h2>
          <p className="text-mid mb-6">Connect wallet to view your cognitive performance dashboard.</p>
          <button onClick={connect} className="px-7 py-3 rounded-lg bg-brand text-white font-medium shadow-brand hover:bg-brand-dark transition-all">Connect Wallet</button>
        </div>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-base dot-grid">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="mb-10">
          <p className="text-xs font-mono text-brand-light uppercase tracking-widest mb-2">Skill Analytics</p>
          <h1 className="font-display text-4xl font-bold text-hi mb-2">Your cognitive profile.</h1>
          <p className="text-mid">Insights based on your verified assessment results.</p>
        </motion.div>

        {badges.length === 0 ? (
          <div className="text-center py-20 bg-surface border border-border rounded-2xl">
            <p className="text-4xl mb-4">📊</p>
            <p className="font-display font-bold text-hi mb-2">No data yet</p>
            <p className="text-mid mb-6">Take assessments to unlock your cognitive analytics.</p>
            <Link href="/#assessments" className="px-6 py-3 rounded-xl bg-brand text-white font-medium shadow-brand hover:bg-brand-dark transition-all">
              Take an Assessment
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {INSIGHTS.map((ins,i)=>(
                <motion.div key={i} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
                  className="p-5 bg-surface border border-border rounded-2xl">
                  <div className={`mb-3 ${ins.color}`}>{ins.icon}</div>
                  <p className="text-xs text-lo font-mono mb-1">{ins.title}</p>
                  <p className={`font-display font-bold text-xl ${ins.color}`}>{ins.value}</p>
                  <p className="text-xs text-lo mt-1">{ins.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <p className="text-xs font-mono text-lo uppercase tracking-wider mb-5">Score Breakdown</p>
              <div className="space-y-4">
                {badges.map((b,i)=>(
                  <motion.div key={b.id} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-mid">{b.testTitle}</span>
                      <span className="font-mono font-bold text-hi">{b.score}/100</span>
                    </div>
                    <div className="h-2 bg-raised rounded-full overflow-hidden">
                      <motion.div initial={{width:0}} animate={{width:`${b.score}%`}} transition={{duration:1,delay:i*0.1+0.3}}
                        className={`h-full rounded-full ${b.tier==="gold"?"bg-gradient-to-r from-yellow-500 to-amber-400":b.tier==="silver"?"bg-gradient-to-r from-slate-400 to-slate-300":"bg-gradient-to-r from-orange-600 to-amber-600"}`}/>
                    </div>
                    <div className="flex justify-between text-xs text-lo mt-1">
                      <span>Top {b.percentile}% globally</span>
                      <span>{b.tier.charAt(0).toUpperCase()+b.tier.slice(1)} · +{b.reward} COG</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
