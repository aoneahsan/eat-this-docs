/**
 * Who publishes this guide and the product it describes, as one JSON-LD @graph in every page's head
 * (eat-this-docs#1 AEO boxes: WebSite, publisher, SoftwareApplication).
 *
 * Person and Organization: `projects-finalization-record/ecosystem/owner-profile.json` (lastUpdated 2026-11-27), the
 * record aoneahsan.com and every product share, so every site names the same author. Offers: the app's plans
 * (`eat-this/src/lib/plans.ts`, shown on https://eatthis.aoneahsan.com/pricing and in docs/plans-and-privacy.md). Both
 * live outside this repo; a change there is copied here by hand, and `plugins/seo-contract.mts` checks the shape.
 */
const SITE = 'https://eatthis-docs.aoneahsan.com';
const APP = 'https://eatthis.aoneahsan.com';
const PERSON_ID = 'https://aoneahsan.com/#person';
const ORG_ID = 'https://zaions.com/#organization';

const monthly = (name: string, price: string, description: string) => ({
  '@type': 'Offer', name, description, price, priceCurrency: 'USD', url: `${APP}/pricing`,
  priceSpecification: { '@type': 'UnitPriceSpecification', price, priceCurrency: 'USD', billingDuration: 'P1M', unitText: 'month' },
});

export const PUBLISHER_GRAPH = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person', '@id': PERSON_ID, name: 'Ahsan Mahmood', alternateName: ['Ahsan', 'aoneahsan', 'a1ahsan', 'A1 Ahsan', 'AOne Ahsan'],
      url: 'https://aoneahsan.com', jobTitle: 'Founder and developer, Zaions', worksFor: { '@id': ORG_ID },
      sameAs: ['https://aoneahsan.com', 'https://zaions.com', 'https://github.com/aoneahsan', 'https://www.linkedin.com/in/aoneahsan',
        'https://www.npmjs.com/~aoneahsan', 'https://www.upwork.com/freelancers/aoneahsan', 'https://orcid.org/0009-0006-2311-8687'],
    },
    {
      '@type': 'Organization', '@id': ORG_ID, name: 'Zaions', alternateName: ['Zaions products', 'Zaions projects'], url: 'https://zaions.com',
      logo: 'https://zaions.com/assets/logos/zaions-mark.png', founder: { '@id': PERSON_ID }, sameAs: ['https://zaions.com', 'https://github.com/aoneahsan'],
    },
    {
      '@type': 'WebSite', '@id': `${SITE}/#website`, name: 'Eat This guide', url: `${SITE}/`, inLanguage: 'en-GB',
      publisher: { '@id': ORG_ID }, author: { '@id': PERSON_ID }, about: { '@id': `${APP}/#app` },
    },
    {
      '@type': 'SoftwareApplication', '@id': `${APP}/#app`, name: 'Eat This', url: `${APP}/`, applicationCategory: 'HealthApplication',
      applicationSubCategory: 'Nutrition', operatingSystem: 'Web browser', isAccessibleForFree: true, inLanguage: 'en-GB',
      description: 'Pick a nutrient, a feeling or the time of day. Eat This names the natural food that does the job, the amount in one serving, a cheap pick and a pick worth paying more for. A suggestion, not a diagnosis.',
      image: `${APP}/share/eat-this-share-1200x630.png`, author: { '@id': PERSON_ID }, creator: { '@id': PERSON_ID }, publisher: { '@id': ORG_ID },
      sameAs: [`${SITE}/`],
      offers: [
        { '@type': 'Offer', name: 'Free', description: 'Every food, list and comparison; 3 reminder times; AI questions with a daily limit.', price: '0', priceCurrency: 'USD', url: `${APP}/pricing` },
        monthly('Plus', '9.99', 'More AI questions a day, a daily plan built around your diet and budget, 8 reminder times.'),
        monthly('Family (per person)', '8.99', 'Plus for everyone at home, from 3 people; each person keeps their own diet, reminders and favourites.'),
      ],
    },
  ],
};
