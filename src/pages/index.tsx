import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

export default function Home() {
  return (
    <Layout title="Eat This docs" description="How Eat This picks foods, where every number comes from, and how to use it.">
      <main className="container margin-vert--xl">
        <h1>Eat This, and here's why.</h1>
        <p className="hero__subtitle">Pick a nutrient, a feeling or the time of day. Eat This names the plain food that does it, the number for one serving, a cheap pick, and when it's a question for your doctor instead.</p>
        <p>This guide explains how it works: how foods are ranked, where every number comes from, how sure we are about each suggestion, and what the app keeps about you.</p>
        <div className="margin-top--lg">
          <Link className="button button--primary button--lg margin-right--sm" to="/guide/start">Start here</Link>
          <Link className="button button--secondary button--lg" href="https://eatthis.aoneahsan.com">Open the app</Link>
        </div>
        <ul className="margin-top--xl">
          <li><strong>128 whole foods</strong>, every value linked to USDA FoodData Central or IFCT 2017.</li>
          <li><strong>10 nutrients</strong>, each opening with the best food, the best cheap one and the one worth paying more for.</li>
          <li><strong>10 feelings</strong>, each checking warning signs before it lists a single food.</li>
        </ul>
      </main>
    </Layout>
  );
}
