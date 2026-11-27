/**
 * The build-output SEO contract (eat-this-docs#1; SA-P20, P26, P29, P30, P31): the build fails instead of a search
 * console finding it a month later. `yarn build` runs it last (`yarn seo:contract`), on the files GitHub Pages will
 * serve. A separate step, because Docusaurus runs plugins' `postBuild` hooks concurrently.
 *
 * - `trailingSlash: true` and `onBrokenLinks: 'throw'`: every page is `<route>/index.html`, so GitHub Pages 301s `/x`
 *   to `/x/` and never 404s the slashed form (SA-P26).
 * - Every page: one `<title>`, one description, one self-canonical in the slashed form, no `noindex` (owner law,
 *   2026-11-27), the 1200 x 630 share card, and every JSON-LD block parses with the publisher @graph in it (SA-P20/P30).
 * - The home page carries the Yandex ownership meta (eat-this-docs#1 box 1).
 * - Every `sitemap.xml` URL is slashed, exists in the output, and is linked from at least two other pages.
 * - Every redirect stub the site keeps (`REDIRECTS`) exists and lands on a page that exists (SA-P31).
 */
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const SITE = 'https://eatthis-docs.aoneahsan.com';
const PAGE_EXCEPTIONS = new Set(['404.html']);
/** Old addresses kept as static redirect pages in `static/` (from → to). */
export const REDIRECTS: ReadonlyArray<readonly [string, string]> = [['/docs/developers/', '/guide/developers/']];

const count = (html: string, pattern: RegExp): number => html.match(pattern)?.length ?? 0;
const isRedirectPage = (html: string): boolean => /http-equiv=["']?refresh/i.test(html);
const servedFile = (outDir: string, route: string): string => path.join(outDir, route.replace(/^\/|\/$/g, ''), 'index.html');

function htmlFiles(dir: string, base = dir): string[] {
  return readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full, base);
    return entry.name.endsWith('.html') ? [path.relative(base, full).split(path.sep).join('/')] : [];
  });
}

/**
 * Checks one built page against the contract.
 *
 * @param html - the page's HTML
 * @param file - its path relative to the output folder
 * @returns the problems found, empty when the page passes
 */
export function pageProblems(html: string, file: string): string[] {
  if (PAGE_EXCEPTIONS.has(file) || isRedirectPage(html)) return [];
  const problems: string[] = [];
  if (!file.endsWith('index.html')) problems.push('a page outside <route>/index.html is a 404 for its slashed address');
  const canonicals = [...html.matchAll(/<link[^>]+rel=["']?canonical["']?[^>]*>/g)];
  const href = /href=["']?([^"'\s>]+)/.exec(canonicals[0]?.[0] ?? '')?.[1] ?? '';
  if (count(html, /<title[\s>]/g) !== 1) problems.push(`${count(html, /<title[\s>]/g)} <title> tags`);
  if (count(html, /<meta[^>]+name=["']?description["']?[\s>/]/g) !== 1) problems.push('meta description count is not 1');
  if (canonicals.length !== 1) problems.push(`${canonicals.length} canonicals`);
  else if (!href.startsWith(SITE) || !href.endsWith('/')) problems.push(`canonical ${href} is not on ${SITE} in the slashed form`);
  if (/<meta[^>]+name=["']?robots["']?[^>]+noindex/i.test(html)) problems.push('noindex on a public page');
  if (!/<meta[^>]+property=["']?og:image["']?[^>]+content=["']?https:\/\/eatthis-docs\.aoneahsan\.com\/img\/eat-this-share-1200x630\.png/.test(html)) problems.push('no share card og:image');
  const types: string[] = [];
  for (const [, json = ''] of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const parsed = JSON.parse(json) as {'@graph'?: {'@type': string; '@id'?: string; offers?: unknown[]}[]};
      for (const node of parsed['@graph'] ?? []) types.push(`${node['@type']}${node['@id'] ? ` ${node['@id']}` : ''}${node.offers ? ` offers:${node.offers.length}` : ''}`);
      if (/SearchAction/.test(json)) problems.push('a SearchAction (the site has no search-by-URL route)');
    } catch {
      problems.push('a JSON-LD block does not parse');
    }
  }
  for (const need of ['Person https://aoneahsan.com/#person', 'Organization https://zaions.com/#organization', `WebSite ${SITE}/#website`, 'SoftwareApplication https://eatthis.aoneahsan.com/#app offers:3']) {
    if (!types.includes(need)) problems.push(`publisher @graph lacks ${need}`);
  }
  return problems.map((problem) => `${file}: ${problem}`);
}

/**
 * Checks the whole output folder.
 *
 * @param outDir - the build folder
 * @param config - the text of docusaurus.config.ts
 * @returns the problems found
 */
export function siteProblems(outDir: string, config: string): string[] {
  const problems: string[] = [];
  if (!/^\s*trailingSlash: true,/m.test(config)) problems.push('trailingSlash must be true: GitHub Pages 404s the slashed form otherwise');
  if (!/^\s*onBrokenLinks: 'throw',/m.test(config)) problems.push("onBrokenLinks must be 'throw'");
  const files = htmlFiles(outDir);
  const pages = new Map(files.map((file) => [file, readFileSync(path.join(outDir, file), 'utf8')]));
  for (const [file, html] of pages) problems.push(...pageProblems(html, file));
  if (!/<meta[^>]+name=["']?yandex-verification["']?[^>]+content=["']?bfb02722189028cf/.test(pages.get('index.html') ?? '')) problems.push('index.html: no yandex-verification meta');

  const inbound = new Map<string, Set<string>>();
  for (const [file, html] of pages) {
    const from = `/${file.replace(/index\.html$/, '')}`;
    for (const [, href = ''] of html.matchAll(/<a[^>]+href=["']((?:https:\/\/eatthis-docs\.aoneahsan\.com)?\/[^"'#?]*)/g)) {
      const to = href.replace(SITE, '');
      if (to !== from) inbound.set(to, (inbound.get(to) ?? new Set()).add(from));
    }
  }
  const sitemap = path.join(outDir, 'sitemap.xml');
  if (!existsSync(sitemap)) problems.push('sitemap.xml is missing');
  for (const [, loc = ''] of existsSync(sitemap) ? readFileSync(sitemap, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g) : []) {
    const route = loc.replace(SITE, '');
    if (!loc.startsWith(SITE) || !loc.endsWith('/')) problems.push(`sitemap: ${loc} is not on ${SITE} in the slashed form`);
    else if (!existsSync(servedFile(outDir, route))) problems.push(`sitemap: ${loc} has no page in the output`);
    else if (route !== '/' && (inbound.get(route)?.size ?? 0) < 2) problems.push(`sitemap: ${loc} is linked from fewer than 2 pages`);
  }
  for (const [from, to] of REDIRECTS) {
    const file = servedFile(outDir, from);
    if (!existsSync(file) || !isRedirectPage(readFileSync(file, 'utf8'))) problems.push(`redirect ${from} → ${to} was not written`);
    if (!existsSync(servedFile(outDir, to))) problems.push(`redirect target ${to} has no page`);
  }
  return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const siteDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  const problems = siteProblems(path.join(siteDir, 'build'), readFileSync(path.join(siteDir, 'docusaurus.config.ts'), 'utf8'));
  if (problems.length > 0) {
    process.stderr.write(`seo-contract: ${problems.length} problem(s)\n${problems.slice(0, 60).join('\n')}\n`);
    process.exit(1);
  }
  process.stdout.write('seo-contract: the build passes\n');
}
