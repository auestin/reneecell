export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'zh', 'ja', 'es', 'kr', 'zh-CN', 'id', 'vi', 'th'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

const dictionaries: Record<Locale, () => Promise<any>> = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  zh: () => import('./dictionaries/zh.json').then((module) => module.default),
  ja: () => import('./dictionaries/ja.json').then((module) => module.default),
  es: () => import('./dictionaries/es.json').then((module) => module.default),
  kr: () => import('./dictionaries/kr.json').then((module) => module.default),
  'zh-CN': () => import('./dictionaries/zh-CN.json').then((module) => module.default),
  id: () => import('./dictionaries/id.json').then((module) => module.default),
  vi: () => import('./dictionaries/vi.json').then((module) => module.default),
  th: () => import('./dictionaries/th.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]?.() ?? dictionaries.en();
};
