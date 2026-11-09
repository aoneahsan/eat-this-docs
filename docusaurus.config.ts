import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

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
        { title: 'Guide', items: [{ label: 'Start here', to: '/guide/start' }, { label: 'How we rank', to: '/guide/ranking' }, { label: 'Sources', to: '/guide/sources' }] },
        { title: 'App', items: [{ label: 'Eat This', href: 'https://eatthis.aoneahsan.com' }, { label: 'Privacy', href: 'https://eatthis.aoneahsan.com/privacy' }, { label: 'Terms', href: 'https://eatthis.aoneahsan.com/terms' }] },
      ],
      copyright: `© ${new Date().getFullYear()} Eat This. A suggestion, not a diagnosis.`,
    },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
  } satisfies Preset.ThemeConfig,
};

export default config;
