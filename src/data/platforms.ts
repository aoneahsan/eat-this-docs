/**
 * Every place Eat This is released — the ONLY place a store or surface URL lives in this docs site
 * (standard aoneahsan-cccs-platform-links). Each surface passed its release proof on `verified`:
 * the web app and this site answered 200. The Android app is not on Google Play yet, so it is not listed.
 */
export type PlatformId = 'web' | 'docs';

export interface Platform {
  id: PlatformId;
  /** Store or surface name (a proper name, not copy). */
  name: string;
  href: string;
  /** What this surface is for, in Eat This's words. */
  title: string;
  text: string;
  cta: string;
  primary?: boolean;
  verified: string;
}

export const PLATFORMS: readonly Platform[] = [
  {id: 'web', name: 'Eat This web app', href: 'https://eatthis.aoneahsan.com', title: 'In your browser', text: 'Pick a nutrient, a feeling or the time of day and get the plain food that does it, with the number for one serving.', cta: 'Open Eat This', primary: true, verified: '2026-11-20'},
  {id: 'docs', name: 'Guide', href: 'https://eatthis-docs.aoneahsan.com', title: 'This guide', text: 'How Eat This ranks foods, where the numbers come from, and when a question is one for your doctor.', cta: 'Read the guide', verified: '2026-11-20'},
];

export const APPS_PAGE = {
  title: 'Get Eat This',
  description: 'Every place Eat This is released: the web app and this guide.',
  lead: 'Eat This runs in your browser on any phone or computer. Keep the guide a tab away.',
} as const;

/** This site is the docs surface. */
export const CURRENT_SURFACE: PlatformId = 'docs';
export const OTHER_PLATFORMS: readonly Platform[] = PLATFORMS.filter((platform) => platform.id !== CURRENT_SURFACE);
export const PRIMARY_PLATFORM: Platform = PLATFORMS.find((platform) => platform.primary) ?? PLATFORMS[0];
export function platformHref(id: PlatformId): string {
  const found = PLATFORMS.find((platform) => platform.id === id);
  if (!found) throw new Error(`Unknown platform: ${id}`);
  return found.href;
}
/** `/apps` changes only when this list does: its sitemap date is the newest proof date. */
export const APPS_LASTMOD: string = PLATFORMS.map((platform) => platform.verified).sort().at(-1) ?? '2026-11-20';
