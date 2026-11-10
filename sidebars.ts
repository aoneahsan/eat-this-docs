import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  guide: ['start', 'ways-in', 'ranking', 'filters', 'sources', 'evidence-and-safety', 'reminders', 'plans-and-privacy', 'faq',
    { type: 'category', label: 'Other apps compared', link: { type: 'doc', id: 'compare/index' }, items: ['compare/cronometer', 'compare/fooducate', 'compare/lifesum', 'compare/lose-it', 'compare/myfitnesspal', 'compare/myfooddata', 'compare/mynetdiary', 'compare/nutritionvalue', 'compare/usda-fooddata-central', 'compare/yazio', 'compare/yuka'] }],
};

export default sidebars;
