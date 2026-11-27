# Search-console fix log: eat-this-docs (eatthis-docs.aoneahsan.com)

Newest entry first. One section per issue. Not a page: `docusaurus.config.ts` excludes `search-consoles/**`.
`live-verified` is ours; `indexed` belongs to Google.

## eat-this-docs#1 — eatthis: indexing issues found in Google/Bing/Yandex audit · 2026-11-27 · commit: (filled by the commit that ships this entry)

Status: **built and contract-verified locally; publish to gh-pages, live proof, Yandex Verify and IndexNow pending**.

The app boxes of this issue (thin home page, publisher and sameAs, og:image on `eatthis.aoneahsan.com`) are fixed in
`aoneahsan/eat-this`; their record is that repo's `docs/search-consoles/fix-log.md`.

| Box | SA | What was wrong (evidence) | Root fix (file:line) | Contract test | Live proof (command → result) |
|---|---|---|---|---|---|
| 1 · Yandex ownership | SA-P23 | No `yandex-verification` meta (HEAD `docusaurus.config.ts:74`, themeConfig had no metadata) | `docusaurus.config.ts:95` `{ name: 'yandex-verification', content: 'bfb02722189028cf' }` on every page | `plugins/seo-contract.mts` (home must carry it) | pending publish: `curl -s https://eatthis-docs.aoneahsan.com/ \| grep -o 'yandex-verification" content="[^"]*'` → `bfb02722189028cf` |
| AEO · no JSON-LD at all | SA-P20/P30 | No `ld+json` in any page (HEAD `docusaurus.config.ts:62`, no headTags) | `src/data/publisher.ts` @graph: Person `https://aoneahsan.com/#person` with sameAs, Organization `https://zaions.com/#organization`, WebSite `#website`, SoftwareApplication `https://eatthis.aoneahsan.com/#app` with Free / Plus $9.99 / Family $8.99 offers; in every page head from `docusaurus.config.ts:70` | `seo-contract.mts` (all four nodes, 3 offers, parses, no SearchAction) | pending publish: `curl -s …/guide/reminders/ \| grep -c 'application/ld+json'` → ≥ 1 |
| AEO · no og:image | SA-P03 | No `image` in themeConfig | `docusaurus.config.ts:92` `image: 'img/eat-this-share-1200x630.png'` (the app's share card, `static/img/`), with width, height and alt at `:96-98` | `seo-contract.mts` (og:image on every page) | `curl -sI https://eatthis-docs.aoneahsan.com/img/eat-this-share-1200x630.png \| head -1` → 200 |
| 1 page discovered, not indexed: `/guide/reminders` | SA-P34 + links | 122 words; linked only from the sidebar | `docs/reminders.md` rewritten from the app's own code: what a reminder says (the real line format and fallback), the seven parts of the day and the nutrient each leads with (`eat-this/src/lib/catalogue.ts` NOW_RULES), plan limits, the default two times, quiet hours, Android/browser/account, why it can be late, news, calendar and keys. Descriptive links to it from `ways-in.md`, `daily-plan.md`, `plans-and-privacy.md`, `account.md`, `developers/calendar-feed.md`, and `static/llms.txt` | `seo-contract.mts` (every sitemap URL linked from ≥ 2 pages) | pending publish: `curl -s -o /dev/null -w '%{http_code}' …/guide/reminders/` → 200; `/guide/reminders` → 301 |
| Slash form (owner decision 2026-11-27) | SA-P26 | `trailingSlash: false` wrote `x.html`; `/guide/reminders/` answered **404** live (probed 2026-11-27) | `docusaurus.config.ts:61` `trailingSlash: true` and `onBrokenAnchors: 'throw'`; switch traps: feed URLs slashed (`docusaurus.config.ts` `guideItems`), relative Markdown links made file links (`ways-in.md`, `faq.md`), `static/llms.txt` and the `static/docs/developers/` redirect stub point at slashed URLs, the stub lost its `noindex` | `seo-contract.mts` (config, every page `<route>/index.html`, slashed canonical and sitemap, redirect stub lands) | pending publish: both forms of 20 sitemap URLs → 200 or 301 → 200 |

Tag and author pages (SA-P32): **NA**. The site has no blog and no tags, so there is nothing to retire.

Also: the footer's Guide column links "What's changed" (`/feed/`), which no page linked before.

### Pending

| Box | Why not done | Who | Next action |
|---|---|---|---|
| Publish + live proof + IndexNow | This pass never commits or publishes | main session | `yarn build` (runs the contract), then `docsDeployHowTo` in the root tracker (worktree in the workspace `temp/`, `git fetch o gh-pages:refs/remotes/o/gh-pages` first); run Retest; IndexNow every sitemap URL (all changed form) |
| 1 · Press Verify in Yandex Webmaster | Console click | the daily audit / owner | After the publish, Yandex Webmaster → eatthis-docs → Verify (meta tag method) |
| Human `/sitemap` page on the docs site | Not in this issue; the fleet standard wants one | main session | Add a `/sitemap` page (the rentparty-docs `site-pages` plugin is the reference) |

### Retest

```bash
D=https://eatthis-docs.aoneahsan.com
curl -s "$D/" | grep -o 'yandex-verification" content="[^"]*'                    # bfb02722189028cf
for p in /guide/reminders/ /guide/start/ /guide/ranking/ /apps/ /feed/; do
  h=$(curl -s "$D$p"); printf '%s %s slashless:%s canon:%s ldjson:%s ogimg:%s\n' "$p" \
    "$(curl -s -o /dev/null -w '%{http_code}' "$D$p")" "$(curl -s -o /dev/null -w '%{http_code}' "$D${p%/}")" \
    "$(grep -o 'rel="canonical" href="[^"]*"' <<<"$h" | cut -d'"' -f4)" "$(grep -c 'application/ld+json' <<<"$h")" \
    "$(grep -c 'og:image" content' <<<"$h")"; sleep 0.3; done
curl -s "$D/sitemap.xml" | grep -o '<loc>[^<]*' | grep -vc '/$'                   # 0 (every URL slashed)
curl -s -o /dev/null -w '%{http_code}\n' "$D/img/eat-this-share-1200x630.png"     # 200
```

Expected: slashed form 200, slashless 301, canonical slashed, `ldjson` 1, `ogimg` 1.
