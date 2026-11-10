import Link from '@docusaurus/Link';
import hub from '@site/src/data/competitors.json';

/*
 * The docs half of the Comparison Hub. Same dated facts as the app (src/data/competitors.json is copied from
 * eat-this/docs/comparison-hub by `yarn sync:hub` before every build), a different job: moving across.
 * Every link to another company opens a new tab with rel="noopener noreferrer nofollow".
 */

type Status = 'yes' | 'no' | 'partial' | 'not-stated';
interface Claim { status: Status; source?: string; note?: string }
interface Price { plan: string; amount: number | null; currency: string | null; period: 'month' | 'year' | null; note: string | null; source: string }
interface Competitor { slug: string; name: string; officialUrl: string; whatItIs: string; lastChecked: string; prices: Price[]; features: Record<string, Claim>; strongerThere: string; strongerHere: string }

const DATA = hub as unknown as { lastChecked: string; features: { key: string; label: string }[]; ours: { features: Record<string, Claim> }; competitors: Competitor[] };
const RIVALS = [...DATA.competitors].sort((a, b) => a.name.localeCompare(b.name));
const WORD: Record<Status, string> = { yes: 'Yes', no: 'No', partial: 'Partly', 'not-stated': 'Not stated on the pages we checked' };
const day = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

function priceText(p: Price): string {
  if (p.amount === null) return 'Not on their pages';
  if (p.amount === 0) return 'Free';
  return `${p.currency ? `${p.currency} ` : ''}${p.amount.toLocaleString('en-GB')}${p.period ? ` a ${p.period}` : ''}`;
}

function Out({ href }: { href: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer nofollow">{href.replace(/^https?:\/\//, '')}</a>;
}

/** The list on the hub page: one line per app with its check date. */
export function HubList() {
  return (
    <ul>
      {RIVALS.map((c) => (
        <li key={c.slug}><Link to={`/guide/compare/${c.slug}`}>{c.name}</Link>: {c.whatItIs} <em>(read {day(c.lastChecked)})</em></li>
      ))}
    </ul>
  );
}

/** One app: how it differs, what it costs, the rows that differ, how to use Eat This beside it, and the sources. */
export function Rival({ slug }: { slug: string }) {
  const c = DATA.competitors.find((x) => x.slug === slug);
  if (!c) throw new Error(`Unknown competitor ${slug}`);
  const sources = [...new Set([c.officialUrl, ...c.prices.map((p) => p.source), ...Object.values(c.features).map((f) => f.source)].filter((u): u is string => !!u))];
  const differ = DATA.features.filter((f) => (c.features[f.key]?.status ?? 'not-stated') !== DATA.ours.features[f.key].status);
  return (
    <>
      <p><strong>{c.name}:</strong> {c.whatItIs} Read on {c.name}'s own pages on <time dateTime={c.lastChecked}>{day(c.lastChecked)}</time>. Prices change, so the sources are at the bottom.</p>

      <h2>How they differ</h2>
      <p>{c.strongerThere}</p>
      <p>{c.strongerHere}</p>
      <table>
        <thead><tr><th>What it does</th><th>{c.name}</th><th>Eat This</th></tr></thead>
        <tbody>
          {differ.map((f) => {
            const them = c.features[f.key] ?? { status: 'not-stated' as const };
            return <tr key={f.key}><td>{f.label}</td><td>{WORD[them.status]}{them.note ? ` (${them.note})` : ''}</td><td>{WORD[DATA.ours.features[f.key].status]}</td></tr>;
          })}
        </tbody>
      </table>

      <h2>What it costs</h2>
      <ul>{c.prices.map((p) => <li key={`${p.plan}-${p.period}-${p.amount}`}>{c.name} {p.plan}: {priceText(p)}{p.note ? ` (${p.note})` : ''}</li>)}</ul>
      <p>Eat This: every food, list and comparison is free with no account. Plus and Family add more AI answers and a daily plan; the current prices are on the <a href="https://eatthis.aoneahsan.com/pricing">pricing page</a>.</p>

      <h2>Using Eat This beside {c.name}</h2>
      <p>There's nothing to export or import. Eat This keeps no diary and needs no account, so {c.name} can stay where it is.</p>
      <ol>
        <li>Open <a href="https://eatthis.aoneahsan.com/welcome">Eat This</a> and set how you eat once: your diet, what to leave out and your budget. See <Link to="/guide/filters">Filters</Link>.</li>
        <li>Start from what you need: Now for this hour, I need… for a nutrient, I'm feeling… for a day like today. See <Link to="/guide/ways-in">The four ways in</Link>.</li>
        <li>Read the three rows: best, best cheap and worth paying more for. See <Link to="/guide/ranking">How we rank</Link>.</li>
        <li>Tap the source chip on any number to open the public record behind it. See <Link to="/guide/sources">Where the numbers come from</Link>.</li>
      </ol>

      <h2>Check it yourself</h2>
      <p>Every fact about {c.name} here comes from these pages, read on {day(c.lastChecked)}:</p>
      <ul>{sources.map((u) => <li key={u}><Out href={u} /></li>)}</ul>
      <p>The same comparison, with every row: <a href={`https://eatthis.aoneahsan.com/compare-apps/${c.slug}`}>Eat This and {c.name}</a>.</p>
    </>
  );
}
