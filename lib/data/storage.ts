"use client";
import { BadgeRecord, ConsentGrant, AccessRequest, DisclosureLevel } from "@/lib/types";

const KEYS = {
  badges:   "cog_badges_v2",
  consents: "cog_consents_v2",
  requests: "cog_requests_v2",
  wallets:  "cognify_wallets",
};

// ─── Badges ────────────────────────────────────────────────
export function getBadges(address: string): BadgeRecord[] {
  try {
    const all: BadgeRecord[] = JSON.parse(localStorage.getItem(KEYS.badges) || "[]");
    return all.filter(b => b.walletAddr.toLowerCase() === address.toLowerCase());
  } catch { return []; }
}

export function getBadge(id: string): BadgeRecord | null {
  try {
    const all: BadgeRecord[] = JSON.parse(localStorage.getItem(KEYS.badges) || "[]");
    return all.find(b => b.id === id) || null;
  } catch { return null; }
}

export function saveBadge(badge: BadgeRecord): void {
  try {
    const all: BadgeRecord[] = JSON.parse(localStorage.getItem(KEYS.badges) || "[]");
    const filtered = all.filter(b => b.id !== badge.id);
    localStorage.setItem(KEYS.badges, JSON.stringify([...filtered, badge]));
  } catch {}
}

// ─── Consents ──────────────────────────────────────────────
export function getConsents(address: string): ConsentGrant[] {
  try {
    const all: ConsentGrant[] = JSON.parse(localStorage.getItem(KEYS.consents) || "[]");
    const badges = getBadges(address).map(b => b.id);
    return all.filter(c => badges.includes(c.badgeId));
  } catch { return []; }
}

export function getConsent(badgeId: string, recruiterAddr: string): ConsentGrant | null {
  try {
    const all: ConsentGrant[] = JSON.parse(localStorage.getItem(KEYS.consents) || "[]");
    return all.find(c => c.badgeId === badgeId && c.recruiterAddr === recruiterAddr) || null;
  } catch { return null; }
}

export function saveConsent(consent: ConsentGrant): void {
  try {
    const all: ConsentGrant[] = JSON.parse(localStorage.getItem(KEYS.consents) || "[]");
    const filtered = all.filter(c => !(c.badgeId === consent.badgeId && c.recruiterAddr === consent.recruiterAddr));
    localStorage.setItem(KEYS.consents, JSON.stringify([...filtered, consent]));
  } catch {}
}

export function revokeConsent(badgeId: string, recruiterAddr: string): void {
  try {
    const all: ConsentGrant[] = JSON.parse(localStorage.getItem(KEYS.consents) || "[]");
    const filtered = all.filter(c => !(c.badgeId === badgeId && c.recruiterAddr === recruiterAddr));
    localStorage.setItem(KEYS.consents, JSON.stringify(filtered));
  } catch {}
}

// ─── Access Requests ───────────────────────────────────────
export function getRequests(address: string): AccessRequest[] {
  try {
    const all: AccessRequest[] = JSON.parse(localStorage.getItem(KEYS.requests) || "[]");
    const badges = getBadges(address).map(b => b.id);
    return all.filter(r => badges.includes(r.badgeId));
  } catch { return []; }
}

export function saveRequest(req: AccessRequest): void {
  try {
    const all: AccessRequest[] = JSON.parse(localStorage.getItem(KEYS.requests) || "[]");
    const filtered = all.filter(r => r.id !== req.id);
    localStorage.setItem(KEYS.requests, JSON.stringify([...filtered, req]));
  } catch {}
}

// ─── Wallets (COTI AES) ────────────────────────────────────
export function getStoredAesKey(address: string): string | null {
  try {
    const list: { wallet: string; aesKey: string }[] = JSON.parse(localStorage.getItem(KEYS.wallets) || "[]");
    return list.find(w => w.wallet.toLowerCase() === address.toLowerCase())?.aesKey || null;
  } catch { return null; }
}

export function storeAesKey(address: string, aesKey: string): void {
  try {
    const list: { wallet: string; aesKey: string }[] = JSON.parse(localStorage.getItem(KEYS.wallets) || "[]");
    const filtered = list.filter(w => w.wallet.toLowerCase() !== address.toLowerCase());
    localStorage.setItem(KEYS.wallets, JSON.stringify([...filtered, { wallet: address, aesKey }]));
  } catch {}
}

// ─── Public disclosure helper ──────────────────────────────
export function resolveDisclosure(
  badge: BadgeRecord,
  viewerAddr: string,
): DisclosureLevel {
  const publicConsent = getConsent(badge.id, "public");
  const specificConsent = viewerAddr ? getConsent(badge.id, viewerAddr) : null;
  const levels: DisclosureLevel[] = ["tier", "percentile", "score", "full"];
  const publicLevel = publicConsent ? levels.indexOf(publicConsent.level) : 0;
  const specificLevel = specificConsent ? levels.indexOf(specificConsent.level) : -1;
  const idx = Math.max(publicLevel, specificLevel);
  return levels[Math.max(0, idx)];
}
