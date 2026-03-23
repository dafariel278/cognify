"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Shield, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

export default function VerifyLandingPage() {
  const [addr, setAddr] = useState("");
  const [err,  setErr]  = useState("");
  const router = useRouter();

  const go = () => {
    const a = addr.trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(a)) {
      setErr("Please enter a valid wallet address (starting with 0x, 42 characters).");
      return;
    }
    setErr(""); router.push(`/verify/${a}`);
  };

  return (
    <main className="min-h-screen bg-base dot-grid">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-32 pb-16 text-center">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-secure-dim border border-secure/20 flex items-center justify-center mx-auto">
            <Shield className="h-8 w-8 text-secure-light" />
          </div>

          <div>
            <h1 className="font-display text-4xl font-bold text-hi mb-3">Verify a Candidate</h1>
            <p className="text-mid text-lg leading-relaxed">
              Paste a candidate's wallet address to instantly verify their SkillProof Badges.
              No login. No subscription. Completely free.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                type="text" value={addr}
                onChange={e => { setAddr(e.target.value); setErr(""); }}
                onKeyDown={e => e.key === "Enter" && go()}
                placeholder="0x7f3a...e29b"
                className="flex-1 px-4 py-3 bg-surface border border-border rounded-xl
                  text-hi font-mono text-sm placeholder:text-lo
                  focus:border-secure/50 focus:outline-none transition-colors"
              />
              <motion.button
                whileHover={{ scale:1.02, y:-1 }} whileTap={{ scale:0.97 }}
                onClick={go}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-secure text-white font-medium hover:bg-secure-dark transition-all">
                <Search className="h-4 w-4" /> Verify
              </motion.button>
            </div>
            {err && <p className="text-sm text-red-400 text-left">{err}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { icon:"⚡", title:"Instant",   desc:"Verify in under 3 seconds" },
              { icon:"🔐", title:"Private",   desc:"Score stays encrypted" },
              { icon:"⛓",  title:"On-chain", desc:"Cryptographically proven" },
            ].map((f,i) => (
              <div key={i} className="p-4 bg-surface border border-border rounded-xl">
                <div className="text-2xl mb-2">{f.icon}</div>
                <p className="font-display font-semibold text-hi text-sm mb-1">{f.title}</p>
                <p className="text-xs text-lo">{f.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
