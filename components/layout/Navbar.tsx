"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronDown, LogOut, BookOpen, Wallet, Loader2, Zap, Bell } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { shortAddr } from "@/lib/utils";

export function Navbar() {
  const { address, isConnected, hasAesKey, isOnboarding, onboardStatus, connect, disconnect, onboard } = useWallet();
  const [open, setOpen] = useState(false);
  const path = usePathname();

  const navLinks = [
    { href: "/#assessments", label: "Assessments" },
    { href: "/#how-it-works", label: "How it works" },
    { href: "/verify", label: "Verify" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 h-16 glass border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shadow-brand">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="font-display font-bold text-[17px] tracking-[-0.02em]">
            <span className="grad-brand">COGNI</span>
            <span className="text-hi">FY</span>
          </span>
          <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md bg-brand-dim border border-brand/20 text-[10px] font-mono text-brand-light font-medium">
            BETA
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href}
              className="px-3 py-1.5 rounded-lg text-sm text-mid hover:text-hi hover:bg-raised transition-all">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Privacy status */}
          {isConnected && (
            <>
              {!hasAesKey ? (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  onClick={onboard} disabled={isOnboarding}
                  className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium
                    bg-gradient-to-r from-secure-dark to-brand text-white
                    hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isOnboarding
                    ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />{onboardStatus}</>
                    : <><Zap className="h-3.5 w-3.5" />Activate Privacy</>
                  }
                </motion.button>
              ) : (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                  bg-secure-dim border border-secure/20 text-xs font-medium text-secure-light">
                  <div className="w-1.5 h-1.5 rounded-full bg-secure-light animate-pulse" />
                  Privacy Active
                </div>
              )}
            </>
          )}

          {/* Passport link */}
          {isConnected && (
            <Link href="/passport"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg
                text-xs font-medium text-mid hover:text-hi hover:bg-raised transition-all border border-transparent hover:border-border">
              <BookOpen className="h-3.5 w-3.5" />
              My Passport
            </Link>
          )}

          {/* Wallet button */}
          {!isConnected ? (
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
              onClick={connect}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-white
                text-sm font-medium shadow-brand hover:bg-brand-dark transition-all"
            >
              <Wallet className="h-4 w-4" />
              Connect
            </motion.button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpen(p => !p)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border
                  bg-raised text-sm font-mono text-mid hover:border-borderlt hover:text-hi transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                {shortAddr(address!)}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.14 }}
                    onMouseLeave={() => setOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-overlay border border-border rounded-xl shadow-card overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-[11px] text-lo mb-0.5">Connected wallet</p>
                      <p className="text-xs font-mono text-mid truncate">{address}</p>
                    </div>
                    <Link href="/passport" onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-mid hover:text-hi hover:bg-raised transition-colors">
                      <BookOpen className="h-4 w-4" /> My Skill Passport
                    </Link>
                    <button
                      onClick={() => { disconnect(); setOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:bg-raised transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Disconnect
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
