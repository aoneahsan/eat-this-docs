import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

interface FeedItem { title: string; description: string; url: string; date: string }

/** The readable feed: every guide page, newest change first, with the RSS address for readers. */
export default function FeedPage({ items }: { items: FeedItem[] }) {
  return (
    <Layout title="What's changed" description="Every Eat This guide page, newest change first.">
      <main className="container margin-vert--lg">
        <h1>What's changed</h1>
        <p>Every guide page, newest change first. Readers can follow <a href="/feed.xml">the RSS feed</a>.</p>
        <ul>
          {items.map((i) => (
            <li key={i.url}><Link to={i.url.replace('https://eatthis-docs.aoneahsan.com', '')}>{i.title}</Link> · {new Date(i.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}<br /><span>{i.description}</span></li>
          ))}
        </ul>
      </main>
    </Layout>
  );
}
