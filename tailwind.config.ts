import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Bricolage Grotesque", "sans-serif"],
        body:    ["DM Sans", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
      },
      colors: {
        // Base
        base:    "#09090B",
        surface: "#111113",
        raised:  "#18181B",
        overlay: "#1C1C1F",
        border:  "#27272A",
        borderlt:"#3F3F46",
        // Text
        hi:      "#FAFAFA",
        mid:     "#A1A1AA",
        lo:      "#52525B",
        // Brand — Indigo
        brand: {
          DEFAULT: "#6366F1",
          light:   "#818CF8",
          dark:    "#4F46E5",
          dim:     "rgba(99,102,241,0.12)",
          glow:    "rgba(99,102,241,0.25)",
        },
        // Security — Teal
        secure: {
          DEFAULT: "#14B8A6",
          light:   "#2DD4BF",
          dark:    "#0D9488",
          dim:     "rgba(20,184,166,0.10)",
          glow:    "rgba(20,184,166,0.20)",
        },
        // Tiers
        gold:   { DEFAULT:"#F59E0B", light:"#FCD34D", dim:"rgba(245,158,11,0.10)", border:"rgba(245,158,11,0.30)" },
        silver: { DEFAULT:"#94A3B8", light:"#CBD5E1", dim:"rgba(148,163,184,0.10)", border:"rgba(148,163,184,0.25)" },
        bronze: { DEFAULT:"#C2773A", light:"#E8A87C", dim:"rgba(194,119,58,0.10)", border:"rgba(194,119,58,0.25)" },
        // Semantic
        success: "#22C55E",
        warning: "#F59E0B",
        error:   "#EF4444",
      },
      boxShadow: {
        sm:     "0 1px 2px rgba(0,0,0,0.4)",
        card:   "0 0 0 1px rgba(255,255,255,0.04), 0 4px 32px rgba(0,0,0,0.5)",
        brand:  "0 0 24px rgba(99,102,241,0.3), 0 0 0 1px rgba(99,102,241,0.2)",
        secure: "0 0 20px rgba(20,184,166,0.2), 0 0 0 1px rgba(20,184,166,0.15)",
        gold:   "0 0 24px rgba(245,158,11,0.2), 0 0 0 1px rgba(245,158,11,0.25)",
        silver: "0 0 16px rgba(148,163,184,0.15), 0 0 0 1px rgba(148,163,184,0.2)",
        bronze: "0 0 16px rgba(194,119,58,0.2), 0 0 0 1px rgba(194,119,58,0.2)",
      },
      backgroundImage: {
        "mesh-brand":  "radial-gradient(ellipse 70% 50% at 50% -5%, rgba(99,102,241,0.13) 0%, transparent 60%)",
        "mesh-secure": "radial-gradient(ellipse 50% 40% at 80% 70%, rgba(20,184,166,0.08) 0%, transparent 50%)",
        "dot-grid":    "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
        "shine":       "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)",
      },
      animation: {
        "in":          "in .4s ease both",
        "in-up":       "inUp .5s ease both",
        "in-scale":    "inScale .35s ease both",
        "pulse-slow":  "pulse 3s ease-in-out infinite",
        "shimmer":     "shimmer 2s linear infinite",
        "scan":        "scan 4s linear infinite",
        "float":       "float 5s ease-in-out infinite",
        "glow-pulse":  "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        in:        { from:{ opacity:"0" }, to:{ opacity:"1" } },
        inUp:      { from:{ opacity:"0", transform:"translateY(16px)" }, to:{ opacity:"1", transform:"translateY(0)" } },
        inScale:   { from:{ opacity:"0", transform:"scale(0.96)" }, to:{ opacity:"1", transform:"scale(1)" } },
        shimmer:   { from:{ backgroundPosition:"-200% 0" }, to:{ backgroundPosition:"200% 0" } },
        scan:      { from:{ transform:"translateY(-100%)" }, to:{ transform:"translateY(500%)" } },
        float:     { "0%,100%":{ transform:"translateY(0)" }, "50%":{ transform:"translateY(-8px)" } },
        glowPulse: { "0%,100%":{ opacity:"0.5" }, "50%":{ opacity:"1" } },
      },
    },
  },
  plugins: [],
};
export default config;
