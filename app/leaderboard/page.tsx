"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Trophy, Medal, Crown } from "lucide-react";

const DATA = [
  { rank:1,  addr:"0x8f2a...b91c", badges:3, topBadge:"Gold", score:96, skills:["Memory","Logic","Math"] },
  { rank:2,  addr:"0x3d7e...f44a", badges:3, topBadge:"Gold", score:94, skills:["Memory","Logic","Math"] },
  { rank:3,  addr:"0x1b9c...2e87", badges:2, topBadge:"Gold", score:91, skills:["Memory","Logic"] },
  { rank:4,  addr:"0xDDfA...54E4", badges:3, topBadge:"Gold", score:89, skills:["Memory","Logic","Math"] },
  { rank:5,  addr:"0x7f3a...e29b", badges:2, topBadge:"Silver", score:84, skills:["Logic","Math"] },
  { rank:6,  addr:"0x4c1d...9f23", badges:1, topBadge:"Silver", score:81, skills:["Memory"] },
  { rank:7,  addr:"0x9e5b...3a71", badges:2, topBadge:"Silver", score:78, skills:["Memory","Math"] },
  { rank:8,  addr:"0x2a8f...c56d", badges:1, topBadge:"Bronze", score:72, skills:["Logic"] },
  { rank:9,  addr:"0x6d4c...8b12", badges:1, topBadge:"Bronze", score:68, skills:["Math"] },
  { rank:10, addr:"0x5e7a...1f93", badges:1, topBadge:"Bronze", score:61, skills:["Memory"] },
];

const RANK_STYLE: Record<number,string> = {
  1:"text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  2:"text-slate-300 bg-slate-400/10 border-slate-400/30",
  3:"text-orange-400 bg-orange-500/10 border-orange-500/30",
};

export default function LeaderboardPage() {
  const [filter, setFilter] = useState("all");
  return (
    <main className="min-h-screen bg-base dot-grid">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand/20 bg-brand-dim text-brand-light text-xs font-medium mb-4">
            <Trophy className="h-3.5 w-3.5"/>Global Rankings
          </div>
          <h1 className="font-display text-4xl font-bold text-hi mb-2">Skill Leaderboard</h1>
          <p className="text-mid">Top performers ranked by verified cognitive assessment scores.</p>
        </motion.div>

        {/* Top 3 podium */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[DATA[1], DATA[0], DATA[2]].map((d, i) => (
            <motion.div key={d.rank} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
              className={`text-center p-4 bg-surface border rounded-2xl ${RANK_STYLE[d.rank] || "border-border"} ${i===1?"scale-105":""}`}>
              <div className="text-2xl mb-1">{d.rank===1?"🥇":d.rank===2?"🥈":"🥉"}</div>
              <p className="font-mono text-xs text-mid mb-1">{d.addr}</p>
              <p className="font-display font-bold text-2xl text-hi">{d.score}</p>
              <p className="text-xs text-lo">{d.badges} badges</p>
            </motion.div>
          ))}
        </div>

        {/* Full table */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <p className="font-display font-bold text-hi">All Rankings</p>
            <p className="text-xs text-lo font-mono">{DATA.length} verified candidates</p>
          </div>
          {DATA.map((d, i) => (
            <motion.div key={d.rank} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
              className="flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0 hover:bg-raised transition-colors">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border flex-shrink-0 ${RANK_STYLE[d.rank] || "bg-raised border-border text-lo"}`}>
                {d.rank}
              </div>
              <span className="font-mono text-sm text-mid flex-1">{d.addr}</span>
              <div className="flex gap-1.5">
                {d.skills.map(s=>(
                  <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-brand-dim border border-brand/15 text-brand-light">{s}</span>
                ))}
              </div>
              <span className="font-display font-bold text-hi w-10 text-right">{d.score}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
