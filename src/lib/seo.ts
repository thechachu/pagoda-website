// src/lib/seo.ts

export interface SeoData {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogImage?: string;
}

const BASE_URL = 'https://pagoda.ge';

export function getHomeSeo(): SeoData {
  return {
    title: 'Пагода Грузия — Погода в Грузии на 7 дней | pagoda.ge',
    description: 'Пагода в Грузии — точный прогноз погоды для всех городов и курортов. Погода в Тбилиси, Батуми, Гудаури и других городах на сегодня, 7 дней, 30 дней. Пагода 7 дней онлайн.',
    keywords: 'пагода грузия, пагода, пагода в грузии, пагода 7 дней, пагода в тбилиси, погода в грузии, прогноз погоды грузия',
    canonical: BASE_URL,
  };
}

export function getCitySeo(citySlug: string, cityNameRu: string, cityDesc: string): SeoData {
  const cityLower = cityNameRu.toLowerCase();
  const cityGenitive: Record<string, string> = {
    'тбилиси': 'в Тбилиси', 'батуми': 'в Батуми', 'кутаиси': 'в Кутаиси',
    'рустави': 'в Рустави', 'гори': 'в Гори', 'зугдиди': 'в Зугдиди',
    'телави': 'в Телави', 'ахалцихе': 'в Ахалцихе', 'поти': 'в Поти',
    'мцхета': 'в Мцхете', 'чиатура': 'в Чиатуре', 'боржоми': 'в Боржоми',
    'кобулети': 'в Кобулети', 'сигнахи': 'в Сигнахи', 'бакуриани': 'в Бакуриани',
    'гудаури': 'в Гудаури', 'местиа': 'в Местиа', 'уреки': 'в Уреки',
    'саирме': 'в Саирме', 'цхалтубо': 'в Цхалтубо',
  };
  const inCity = cityGenitive[cityLower] || `в ${cityNameRu}`;
  return {
    title: `Пагода ${cityNameRu} — Погода ${inCity} на 7 дней | pagoda.ge`,
    description: `Пагода ${inCity} — точный прогноз погоды на сегодня, 7 дней и 30 дней. ${cityNameRu} — ${cityDesc}. Температура, влажность, ветер онлайн.`,
    keywords: `пагода ${cityLower}, погода ${inCity}, пагода ${cityLower} 7 дней, прогноз погоды ${cityLower}, пагода в грузии, пагода грузия`,
    canonical: `${BASE_URL}/pagoda-${citySlug}`,
  };
}

export function getBlogSeo(): SeoData {
  return {
    title: 'Блог о погоде в Грузии | pagoda.ge',
    description: 'Статьи о климате и погоде в Грузии. Советы путешественникам, прогнозы сезонов, лучшее время для поездки в Тбилиси, Батуми, Гудаури.',
    keywords: 'климат грузии, погода в грузии блог, лучшее время поездки грузия, пагода грузия',
    canonical: `${BASE_URL}/blog`,
  };
}
