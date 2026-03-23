"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Trash2, Plus, Check, ChevronDown } from "lucide-react";
import { BadgeRecord, ConsentGrant, DisclosureLevel, DISCLOSURE_META } from "@/lib/types";
import { getConsents, saveConsent, revokeConsent } from "@/lib/data/storage";

interface Props { badge: BadgeRecord; }

const LEVELS: DisclosureLevel[] = ["tier", "percentile", "score", "full"];

const PRESET_COMPANIES = [
  { name: "Acme Corp",       addr: "tokopedia" },
  { name: "TechCorp Global",  addr: "gojek" },
  { name: "Innovate Inc",          addr: "traveloka" },
  { name: "Nexus Ventures",   addr: "shopee" },
];

export function ConsentPanel({ badge }: Props) {
  const [consents, setConsents] = useState<ConsentGrant[]>([]);
  const [showAdd,  setShowAdd]  = useState(false);
  const [newName,  setNewName]  = useState("");
  const [newAddr,  setNewAddr]  = useState("");
  const [newLevel, setNewLevel] = useState<DisclosureLevel>("percentile");

  useEffect(() => {
    setConsents(getConsents(badge.walletAddr).filter(c => c.badgeId === badge.id));
  }, [badge]);

  const refresh = () => setConsents(getConsents(badge.walletAddr).filter(c => c.badgeId === badge.id));

  const grant = (name: string, addr: string, level: DisclosureLevel) => {
    saveConsent({ badgeId: badge.id, recruiterAddr: addr, recruiterName: name, level, grantedAt: Date.now() });
    refresh();
  };

  const revoke = (addr: string) => { revokeConsent(badge.id, addr); refresh(); };

  const updateLevel = (addr: string, name: string, level: DisclosureLevel) => {
    saveConsent({ badgeId: badge.id, recruiterAddr: addr, recruiterName: name, level, grantedAt: Date.now() });
    refresh();
  };

  const handleAdd = () => {
    if (!newName.trim()) return;
    const addr = newAddr.trim() || newName.toLowerCase().replace(/\s+/g, "-");
    grant(newName.trim(), addr, newLevel);
    setNewName(""); setNewAddr(""); setShowAdd(false);
  };

  const publicConsent = consents.find(c => c.recruiterAddr === "public");

  return (
    <div className="space-y-4">
      {/* Public disclosure */}
      <div className="bg-surface border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-brand-light" />
            <span className="text-sm font-medium text-hi">Public disclosure</span>
          </div>
          <LevelSelect
            value={publicConsent?.level || "tier"}
            onChange={l => grant("Public", "public", l)}
          />
        </div>
        <p className="text-xs text-lo">What anyone sees when visiting your verification link.</p>
      </div>

      {/* Per-company grants */}
      <div className="space-y-2">
        {consents.filter(c => c.recruiterAddr !== "public").map(c => (
          <motion.div key={c.recruiterAddr}
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            className="flex items-center justify-between gap-3 p-3 bg-surface border border-border rounded-xl"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-hi truncate">{c.recruiterName}</p>
              <p className="text-xs text-lo font-mono truncate">{c.recruiterAddr}</p>
            </div>
            <LevelSelect value={c.level} onChange={l => updateLevel(c.recruiterAddr, c.recruiterName, l)} />
            <button onClick={() => revoke(c.recruiterAddr)}
              className="p-2 rounded-lg text-lo hover:text-red-400 hover:bg-red-500/8 transition-colors flex-shrink-0">
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Quick add presets */}
      <div className="space-y-2">
        <p className="text-xs text-lo font-mono uppercase tracking-wider">Quick add</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_COMPANIES.filter(p => !consents.find(c => c.recruiterAddr === p.addr)).map(p => (
            <button key={p.addr}
              onClick={() => grant(p.name, p.addr, "percentile")}
              className="px-3 py-1.5 rounded-lg text-xs border border-border text-mid hover:border-brand/40 hover:text-brand-light hover:bg-brand-dim transition-all"
            >
              + {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Custom add */}
      <AnimatePresence>
        {!showAdd ? (
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 text-sm text-lo hover:text-brand-light transition-colors">
            <Plus className="h-4 w-4" /> Add custom company
          </button>
        ) : (
          <motion.div
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            className="p-4 bg-raised border border-border rounded-xl space-y-3"
          >
            <input value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="Company name"
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-hi placeholder:text-lo focus:border-brand/50 focus:outline-none transition-colors" />
            <input value={newAddr} onChange={e => setNewAddr(e.target.value)}
              placeholder="Wallet address or ID (optional)"
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-xs font-mono text-hi placeholder:text-lo focus:border-brand/50 focus:outline-none transition-colors" />
            <div className="flex items-center gap-2">
              <LevelSelect value={newLevel} onChange={setNewLevel} />
              <button onClick={handleAdd}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand-dark transition-all">
                <Check className="h-4 w-4" /> Grant Access
              </button>
              <button onClick={() => setShowAdd(false)} className="px-3 py-2 text-sm text-lo hover:text-mid">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LevelSelect({ value, onChange }: { value: DisclosureLevel; onChange: (l: DisclosureLevel) => void }) {
  const [open, setOpen] = useState(false);
  const meta = DISCLOSURE_META[value];
  return (
    <div className="relative">
      <button onClick={() => setOpen(p => !p)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-raised text-xs text-mid hover:border-borderlt transition-all">
        {meta.label}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, y:4, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:2, scale:0.97 }} transition={{ duration:0.12 }}
            onMouseLeave={() => setOpen(false)}
            className="absolute right-0 top-full mt-1 w-52 bg-overlay border border-border rounded-xl shadow-card z-20 overflow-hidden"
          >
            {LEVELS.map(l => (
              <button key={l} onClick={() => { onChange(l); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-raised ${value === l ? "text-brand-light" : "text-mid"}`}>
                <div className="font-medium text-hi text-xs mb-0.5">{DISCLOSURE_META[l].label}</div>
                <div className="text-lo text-[11px]">{DISCLOSURE_META[l].desc}</div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
