export type Tier = "gold" | "silver" | "bronze";
export type DisclosureLevel = "tier" | "percentile" | "score" | "full";

export interface TestDef {
  slug:         string;
  title:        string;
  subtitle:     string;
  description:  string;
  longDesc:     string;
  icon:         string;
  color:        "brand" | "secure" | "gold";
  duration:     number;
  available:    boolean;
  totalTakers:  number;
  bronzeMin:    number;
  silverMin:    number;
  goldMin:      number;
  rewards:      { bronze: number; silver: number; gold: number };
  industryBenchmark: Record<string, number>; // e.g. {"Software Engineer": 72}
}

export interface BadgeRecord {
  id:           string;
  testSlug:     string;
  testTitle:    string;
  testSubtitle: string;
  testIcon:     string;
  tier:         Tier;
  score:        number;
  percentile:   number;
  timeTaken:    number; // seconds
  accuracy:     number; // 0-100
  reward:       number;
  txHash:       string;
  timestamp:    number;
  walletAddr:   string;
}

export interface ConsentGrant {
  badgeId:         string;
  recruiterAddr:   string;  // "public" for world-readable
  recruiterName:   string;
  level:           DisclosureLevel;
  grantedAt:       number;
  expiresAt?:      number;
}

export interface AccessRequest {
  id:            string;
  badgeId:       string;
  recruiterAddr: string;
  recruiterName: string;
  company:       string;
  role:          string;
  message:       string;
  requestedLevel: DisclosureLevel;
  requestedAt:   number;
  status:        "pending" | "granted" | "declined";
}

export const TIER_META: Record<Tier, {
  label: string; emoji: string; color: string;
  bg: string; border: string; shadow: string; gradClass: string;
}> = {
  gold: {
    label: "Gold", emoji: "🥇",
    color: "text-gold",
    bg: "bg-gold-dim",
    border: "border-gold-border",
    shadow: "shadow-gold",
    gradClass: "grad-gold",
  },
  silver: {
    label: "Silver", emoji: "🥈",
    color: "text-silver",
    bg: "bg-silver-dim",
    border: "border-silver-border",
    shadow: "shadow-silver",
    gradClass: "grad-silver",
  },
  bronze: {
    label: "Bronze", emoji: "🥉",
    color: "text-bronze",
    bg: "bg-bronze-dim",
    border: "border-bronze-border",
    shadow: "shadow-bronze",
    gradClass: "grad-bronze",
  },
};

export const DISCLOSURE_META: Record<DisclosureLevel, { label: string; desc: string }> = {
  tier:       { label: "Tier only",          desc: "Shows badge tier (Gold/Silver/Bronze)" },
  percentile: { label: "Tier + Percentile",  desc: "Adds global ranking context" },
  score:      { label: "Full score",         desc: "Reveals exact numerical score" },
  full:       { label: "Complete report",    desc: "Everything: score, time, accuracy, benchmark" },
};
