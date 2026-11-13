import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  guide: ['start', 'ways-in', 'ranking', 'filters', 'sources', 'evidence-and-safety', 'reminders', 'account', 'ask', 'daily-plan', 'plans-and-privacy', 'faq',
    { type: 'category', label: 'Mother & baby', link: { type: 'doc', id: 'mother/index' }, items: ['mother/stages', 'mother/food-safety', 'mother/feelings', 'mother/how-we-check'] },
    { type: 'category', label: 'White-label and licensing', link: { type: 'doc', id: 'white-label/overview' }, items: ['white-label/delivery', 'white-label/setup', 'white-label/updates', 'white-label/verify', 'white-label/faq'] },
    { type: 'category', label: 'Other apps compared', link: { type: 'doc', id: 'compare/index' }, items: ['compare/cronometer', 'compare/fooducate', 'compare/lifesum', 'compare/lose-it', 'compare/myfitnesspal', 'compare/myfooddata', 'compare/mynetdiary', 'compare/nutritionvalue', 'compare/usda-fooddata-central', 'compare/yazio', 'compare/yuka'] }],
};

export default sidebars;
