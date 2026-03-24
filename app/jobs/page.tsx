"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Briefcase, MapPin, Clock, Shield, ChevronRight, Search, Filter } from "lucide-react";
import Link from "next/link";
import { useWallet } from "@/context/WalletContext";
import { TIER_META } from "@/lib/types";

const JOBS = [
  { id:"1", company:"Stripe", role:"Senior Software Engineer", location:"Remote", type:"Full-time", salary:"$150k–$200k", posted:"2d ago", requiredBadges:[{slug:"memory-sequence",tier:"silver"},{slug:"pattern-logic",tier:"silver"}], description:"Build the financial infrastructure for the internet. We need strong problem solvers.", verified:true },
  { id:"2", company:"Anthropic", role:"Research Engineer", location:"San Francisco", type:"Full-time", salary:"$180k–$250k", posted:"1d ago", requiredBadges:[{slug:"pattern-logic",tier:"gold"},{slug:"memory-sequence",tier:"gold"}], description:"Work on frontier AI safety research. Exceptional analytical ability required.", verified:true },
  { id:"3", company:"Vercel", role:"Developer Advocate", location:"Remote", type:"Full-time", salary:"$120k–$160k", posted:"3d ago", requiredBadges:[{slug:"speed-math",tier:"bronze"}], description:"Help developers build faster. Communication and technical skills matter.", verified:true },
  { id:"4", company:"Figma", role:"Product Manager", location:"New York", type:"Full-time", salary:"$140k–$190k", posted:"5d ago", requiredBadges:[{slug:"memory-sequence",tier:"silver"},{slug:"speed-math",tier:"silver"}], description:"Shape the future of collaborative design tools.", verified:true },
  { id:"5", company:"Coinbase", role:"Blockchain Engineer", location:"Remote", type:"Full-time", salary:"$160k–$220k", posted:"1d ago", requiredBadges:[{slug:"pattern-logic",tier:"gold"}], description:"Build the cryptoeconomy. Deep technical and mathematical skills required.", verified:true },
  { id:"6", company:"Linear", role:"Frontend Engineer", location:"Remote", type:"Full-time", salary:"$130k–$170k", posted:"4d ago", requiredBadges:[{slug:"memory-sequence",tier:"bronze"},{slug:"speed-math",tier:"bronze"}], description:"Build the best project management tool. Obsessed with quality and performance.", verified:true },
];

const TIER_COLORS: Record<string,string> = {
  gold:"text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  silver:"text-slate-300 bg-slate-400/10 border-slate-400/30",
  bronze:"text-orange-400 bg-orange-500/10 border-orange-500/30",
};

export default function JobsPage() {
  const { isConnected } = useWallet();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string|null>(null);

  const filtered = JOBS.filter(j =>
    j.role.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase())
  );

  const job = JOBS.find(j => j.id === selected);

  return (
    <main className="min-h-screen bg-base dot-grid">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        {/* Header */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-brand-light uppercase tracking-widest">Job Board</span>
            <span className="px-2 py-0.5 rounded-full bg-brand-dim border border-brand/20 text-[10px] font-mono text-brand-light">Badge-verified only</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-hi mb-2">Find your next role.</h1>
          <p className="text-mid">Companies that trust COGNIFY badges. Apply anonymously with your verified skills.</p>
        </motion.div>

        {/* Search */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-surface border border-border rounded-xl">
            <Search className="h-4 w-4 text-lo flex-shrink-0" />
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search roles or companies..."
              className="flex-1 bg-transparent text-hi text-sm placeholder:text-lo focus:outline-none" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Job list */}
          <div className="space-y-3">
            {filtered.map((j,i) => (
              <motion.div key={j.id}
                initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
                onClick={()=>setSelected(j.id)}
                className={`p-5 bg-surface border rounded-2xl cursor-pointer transition-all hover:-translate-y-0.5 ${selected===j.id?"border-brand/40 shadow-brand":"border-border hover:border-borderlt"}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display font-bold text-hi">{j.company}</span>
                      {j.verified && <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-secure-dim border border-secure/20 text-[10px] text-secure-light"><Shield className="h-2.5 w-2.5"/>Verified</div>}
                    </div>
                    <p className="text-mid text-sm">{j.role}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-lo mt-1" />
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="flex items-center gap-1 text-xs text-lo"><MapPin className="h-3 w-3"/>{j.location}</span>
                  <span className="flex items-center gap-1 text-xs text-lo"><Clock className="h-3 w-3"/>{j.posted}</span>
                  <span className="text-xs font-mono text-brand-light">{j.salary}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {j.requiredBadges.map((b,bi)=>(
                    <span key={bi} className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${TIER_COLORS[b.tier]}`}>
                      {TIER_META[b.tier as keyof typeof TIER_META]?.emoji} {b.slug.replace("-"," ")} · {b.tier}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Job detail */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <AnimatePresence mode="wait">
              {job ? (
                <motion.div key={job.id} initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0}}
                  className="bg-surface border border-border rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-display font-bold text-2xl text-hi">{job.company}</h2>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-secure-dim border border-secure/20 text-xs text-secure-light"><Shield className="h-3 w-3"/>Verified</div>
                      </div>
                      <p className="text-mid">{job.role}</p>
                    </div>
                    <span className="font-mono font-bold text-brand-light">{job.salary}</span>
                  </div>

                  <div className="flex gap-4 mb-5 pb-5 border-b border-border text-sm text-mid">
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4"/>{job.location}</span>
                    <span>{job.type}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4"/>{job.posted}</span>
                  </div>

                  <p className="text-mid leading-relaxed mb-5">{job.description}</p>

                  <div className="mb-6">
                    <p className="text-xs font-mono text-lo uppercase tracking-wider mb-3">Required badges</p>
                    <div className="space-y-2">
                      {job.requiredBadges.map((b,i)=>(
                        <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-lg border ${TIER_COLORS[b.tier]}`}>
                          <span className="text-sm capitalize">{b.slug.replace("-"," ")} — {b.tier} or above</span>
                          <Link href={`/test/${b.slug}`} className="text-xs hover:underline">Get badge →</Link>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-brand-dim border border-brand/15 rounded-xl mb-5">
                    <p className="text-xs text-brand-light font-medium mb-1">🔐 Privacy-first application</p>
                    <p className="text-xs text-mid">Your identity stays anonymous until you choose to reveal it. The company only sees your verified badge tier.</p>
                  </div>

                  {isConnected ? (
                    <button className="w-full py-3.5 rounded-xl bg-brand text-white font-display font-bold shadow-brand hover:bg-brand-dark hover:-translate-y-0.5 transition-all">
                      Apply with COGNIFY Badge
                    </button>
                  ) : (
                    <button className="w-full py-3.5 rounded-xl border border-border text-mid text-sm hover:border-brand/30 hover:text-hi transition-all">
                      Connect wallet to apply
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div initial={{opacity:0}} animate={{opacity:1}}
                  className="flex flex-col items-center justify-center py-20 text-center text-mid bg-surface border border-border rounded-2xl"
                >
                  <Briefcase className="h-12 w-12 text-lo mb-4" />
                  <p className="font-display font-bold text-hi mb-1">Select a job</p>
                  <p className="text-sm">Click any listing to see details and apply</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
