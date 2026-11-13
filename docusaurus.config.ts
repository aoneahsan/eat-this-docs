import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from '@docusaurus/types';

const SITE = 'https://eatthis-docs.aoneahsan.com';
interface FeedItem { title: string; description: string; url: string; date: string }

/** Every guide page, newest change first: its title, description and the date git last changed it (truthful). */
function guideItems(): FeedItem[] {
  const walk = (d: string): string[] => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : /\.mdx?$/.test(e.name) ? [join(d, e.name)] : []));
  return walk('docs').map((f) => {
    const text = readFileSync(f, 'utf8');
    const fm = (k: string) => (text.match(new RegExp(`^${k}:\\s*['"]?(.*?)['"]?\\s*$`, 'm'))?.[1] ?? '');
    const slug = f.replace(/^docs\//, '').replace(/\.mdx?$/, '').replace(/\/index$/, '');
    let date = '';
    try { date = execSync(`git log -1 --format=%cI -- "${f}"`).toString().trim(); } catch { /* untracked file */ }
    return { title: fm('title'), description: fm('description'), url: `${SITE}/guide/${slug}`, date: date || new Date().toISOString() };
  }).filter((i) => i.title).sort((a, b) => b.date.localeCompare(a.date));
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The /feed page and /feed.xml (RSS 2.0) every frontend ships, built from the guide itself. */
function feedPlugin(): Plugin {
  return {
    name: 'eatthis-guide-feed',
    loadContent: async () => guideItems(),
    async contentLoaded({ content, actions }) {
      const items = await actions.createData('feed-items.json', JSON.stringify(content as FeedItem[]));
      actions.addRoute({ path: '/feed', component: '@site/src/components/FeedPage.tsx', modules: { items }, exact: true });
    },
    async postBuild({ outDir, content }) {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Eat This guide</title><link>${SITE}/</link><description>How Eat This works: ways in, ranking, sources, Mother &amp; baby, accounts and plans.</description>${(content as FeedItem[]).map((i) => `<item><title>${esc(i.title)}</title><link>${i.url}</link><guid>${i.url}</guid><description>${esc(i.description)}</description><pubDate>${new Date(i.date).toUTCString()}</pubDate></item>`).join('')}</channel></rss>\n`;
      writeFileSync(join(outDir, 'feed.xml'), xml);
    },
  };
}


const config: Config = {
  title: 'Eat This docs',
  tagline: 'How Eat This picks foods, where every number comes from, and how to use it.',
  favicon: 'img/favicon.svg',
  url: 'https://eatthis-docs.aoneahsan.com',
  baseUrl: '/',
  organizationName: 'aoneahsan',
  projectName: 'eat-this-docs',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  i18n: { defaultLocale: 'en-GB', locales: ['en-GB'] },
  markdown: { hooks: { onBrokenMarkdownLinks: 'throw' } },
  plugins: [feedPlugin],
  presets: [
    [
      'classic',
      {
        docs: { routeBasePath: 'guide', sidebarPath: './sidebars.ts' },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
        sitemap: { lastmod: 'date', changefreq: null, priority: null },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    colorMode: { respectPrefersColorScheme: true },
    navbar: {
      title: 'Eat This',
      logo: { alt: 'Eat This', src: 'img/logo.svg' },
      items: [
        { type: 'docSidebar', sidebarId: 'guide', position: 'left', label: 'Guide' },
        { href: 'https://eatthis.aoneahsan.com', label: 'Open the app', position: 'right' },
      ],
    },
    footer: {
      style: 'light',
      links: [
        { title: 'Guide', items: [{ label: 'Start here', to: '/guide/start' }, { label: 'How we rank', to: '/guide/ranking' }, { label: 'Sources', to: '/guide/sources' }, { label: 'White-label', to: '/guide/white-label/overview' }] },
        { title: 'App', items: [{ label: 'Eat This', href: 'https://eatthis.aoneahsan.com' }, { label: 'Privacy', href: 'https://eatthis.aoneahsan.com/privacy' }, { label: 'Terms', href: 'https://eatthis.aoneahsan.com/terms' }, { label: 'White-label pricing', href: 'https://eatthis.aoneahsan.com/white-label/pricing' }] },
      ],
      copyright: `© ${new Date().getFullYear()} Eat This. A suggestion, not a diagnosis.`,
    },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
  } satisfies Preset.ThemeConfig,
};

export default config;
