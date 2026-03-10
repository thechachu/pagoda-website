// src/lib/weather.ts
// ⚠️ API key is loaded from environment variables ONLY — never hardcoded here.
// Configure OPENWEATHER_API_KEY in:
//   - .env (local development)
//   - Cloudflare Pages Dashboard → Settings → Environment Variables (production)

export interface WeatherCurrent {
  city: string;
  cityRu: string;
  temp: number;
  feelsLike: number;
  description: string;
  descriptionRu: string;
  humidity: number;
  windSpeed: number;
  windDir: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  icon: string;
  isDay: boolean;
  sunrise: number;
  sunset: number;
  timezone: number;
  dt: number;
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  pop: number; // probability of precipitation
  humidity: number;
  windSpeed: number;
}

export interface DailyForecast {
  dt: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  pop: number;
  humidity: number;
  windSpeed: number;
  sunrise: number;
  sunset: number;
}

export interface WeatherData {
  current: WeatherCurrent;
  hourly: HourlyForecast[]; // 24 hours
  daily: DailyForecast[];   // 7 days
  daily30?: DailyForecast[]; // extended (from Climate Forecast API)
}

export interface CityInfo {
  slug: string;
  nameRu: string;
  nameEn: string;
  lat: number;
  lon: number;
  description: string;
  isResort: boolean;
}

export const GEORGIA_CITIES: CityInfo[] = [
  { slug: 'tbilisi',     nameRu: 'Тбилиси',     nameEn: 'Tbilisi',     lat: 41.6941, lon: 44.8337, description: 'столица Грузии', isResort: false },
  { slug: 'batumi',      nameRu: 'Батуми',      nameEn: 'Batumi',      lat: 41.6427, lon: 41.6318, description: 'черноморский курорт', isResort: true },
  { slug: 'kutaisi',     nameRu: 'Кутаиси',     nameEn: 'Kutaisi',     lat: 42.2679, lon: 42.7181, description: 'второй по величине город', isResort: false },
  { slug: 'rustavi',     nameRu: 'Рустави',     nameEn: 'Rustavi',     lat: 41.5497, lon: 45.0144, description: 'промышленный город', isResort: false },
  { slug: 'gori',        nameRu: 'Гори',        nameEn: 'Gori',        lat: 41.9857, lon: 44.1133, description: 'исторический город', isResort: false },
  { slug: 'zugdidi',     nameRu: 'Зугдиди',     nameEn: 'Zugdidi',     lat: 42.5089, lon: 41.8713, description: 'город в Мегрелии', isResort: false },
  { slug: 'telavi',      nameRu: 'Телави',      nameEn: 'Telavi',      lat: 41.9195, lon: 45.4739, description: 'сердце Кахетии', isResort: false },
  { slug: 'akhaltsikhe', nameRu: 'Ахалцихе',   nameEn: 'Akhaltsikhe', lat: 41.6408, lon: 42.9913, description: 'исторический город Самцхе', isResort: false },
  { slug: 'poti',        nameRu: 'Поти',        nameEn: 'Poti',        lat: 42.1571, lon: 41.6714, description: 'портовый город', isResort: false },
  { slug: 'mtskheta',    nameRu: 'Мцхета',      nameEn: 'Mtskheta',    lat: 41.8460, lon: 44.7195, description: 'древняя столица Грузии', isResort: false },
  { slug: 'chiatura',    nameRu: 'Чиатура',     nameEn: 'Chiatura',    lat: 42.2847, lon: 43.2719, description: 'город в ущелье', isResort: false },
  { slug: 'borjomi',     nameRu: 'Боржоми',     nameEn: 'Borjomi',     lat: 41.8413, lon: 43.4091, description: 'курорт с минеральными водами', isResort: true },
  { slug: 'kobuleti',    nameRu: 'Кобулети',    nameEn: 'Kobuleti',    lat: 41.8228, lon: 41.7756, description: 'курорт на Чёрном море', isResort: true },
  { slug: 'sighnaghi',   nameRu: 'Сигнахи',     nameEn: 'Sighnaghi',   lat: 41.6127, lon: 45.9224, description: 'город любви в Кахетии', isResort: true },
  { slug: 'bakuriani',   nameRu: 'Бакуриани',   nameEn: 'Bakuriani',   lat: 41.7480, lon: 43.5290, description: 'горнолыжный курорт', isResort: true },
  { slug: 'gudauri',     nameRu: 'Гудаури',     nameEn: 'Gudauri',     lat: 42.4742, lon: 44.4814, description: 'горнолыжный курорт', isResort: true },
  { slug: 'mestia',      nameRu: 'Местиа',      nameEn: 'Mestia',      lat: 43.0531, lon: 42.7310, description: 'горный курорт Сванетии', isResort: true },
  { slug: 'ureki',       nameRu: 'Уреки',       nameEn: 'Ureki',       lat: 41.9632, lon: 41.7493, description: 'магнитный пляжный курорт', isResort: true },
  { slug: 'sairme',      nameRu: 'Саирме',      nameEn: 'Sairme',      lat: 42.0961, lon: 43.1027, description: 'бальнеологический курорт', isResort: true },
  { slug: 'tskaltubo',   nameRu: 'Цхалтубо',    nameEn: 'Tskaltubo',   lat: 42.3289, lon: 42.5994, description: 'курорт с термальными водами', isResort: true },
];

// Simple in-memory cache to avoid API rate limits
interface CacheEntry {
  data: WeatherData;
  timestamp: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function getApiKey(): string {
  const key = import.meta.env.OPENWEATHER_API_KEY;
  if (!key) throw new Error('OPENWEATHER_API_KEY environment variable is not set. Add it to .env or Cloudflare Dashboard.');
  return key;
}

const WEATHER_TRANSLATIONS: Record<string, string> = {
  'clear sky': 'ясное небо',
  'few clouds': 'малооблачно',
  'scattered clouds': 'переменная облачность',
  'broken clouds': 'облачно с прояснениями',
  'overcast clouds': 'пасмурно',
  'light rain': 'небольшой дождь',
  'moderate rain': 'умеренный дождь',
  'heavy intensity rain': 'сильный дождь',
  'very heavy rain': 'очень сильный дождь',
  'thunderstorm': 'гроза',
  'thunderstorm with light rain': 'гроза с небольшим дождём',
  'thunderstorm with rain': 'гроза с дождём',
  'drizzle': 'морось',
  'light intensity drizzle': 'лёгкая морось',
  'snow': 'снег',
  'light snow': 'небольшой снег',
  'heavy snow': 'сильный снег',
  'sleet': 'мокрый снег',
  'fog': 'туман',
  'mist': 'лёгкий туман',
  'haze': 'дымка',
  'dust': 'пыль',
  'smoke': 'дым',
};

function translateWeather(description: string): string {
  const lower = description.toLowerCase();
  return WEATHER_TRANSLATIONS[lower] || description;
}

export async function fetchWeatherByCoords(lat: number, lon: number, cityNameRu: string, cityNameEn: string): Promise<WeatherData> {
  const cacheKey = `${lat},${lon}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const apiKey = getApiKey();
  const baseUrl = 'https://api.openweathermap.org/data/3.0/onecall';
  const url = `${baseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ru&exclude=minutely,alerts`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`OpenWeatherMap API error: ${response.status} ${response.statusText}`);
  }

  const raw = await response.json() as any;

  const localTime = raw.current.dt + raw.timezone_offset - (new Date().getTimezoneOffset() * 60);
  const isDay = raw.current.dt > raw.current.sunrise && raw.current.dt < raw.current.sunset;

  const current: WeatherCurrent = {
    city: cityNameEn,
    cityRu: cityNameRu,
    temp: Math.round(raw.current.temp),
    feelsLike: Math.round(raw.current.feels_like),
    description: raw.current.weather[0].description,
    descriptionRu: translateWeather(raw.current.weather[0].description),
    humidity: raw.current.humidity,
    windSpeed: Math.round(raw.current.wind_speed * 3.6), // m/s to km/h
    windDir: raw.current.wind_deg || 0,
    pressure: Math.round(raw.current.pressure * 0.750062), // hPa to mmHg
    visibility: Math.round((raw.current.visibility || 10000) / 1000),
    uvIndex: raw.current.uvi || 0,
    icon: raw.current.weather[0].icon,
    isDay,
    sunrise: raw.current.sunrise,
    sunset: raw.current.sunset,
    timezone: raw.timezone_offset,
    dt: raw.current.dt,
  };

  const hourly: HourlyForecast[] = (raw.hourly || []).slice(0, 24).map((h: any) => ({
    dt: h.dt,
    temp: Math.round(h.temp),
    feelsLike: Math.round(h.feels_like),
    description: h.weather[0].description,
    icon: h.weather[0].icon,
    pop: Math.round((h.pop || 0) * 100),
    humidity: h.humidity,
    windSpeed: Math.round(h.wind_speed * 3.6),
  }));

  const daily: DailyForecast[] = (raw.daily || []).slice(0, 7).map((d: any) => ({
    dt: d.dt,
    tempMin: Math.round(d.temp.min),
    tempMax: Math.round(d.temp.max),
    description: d.weather[0].description,
    icon: d.weather[0].icon,
    pop: Math.round((d.pop || 0) * 100),
    humidity: d.humidity,
    windSpeed: Math.round(d.wind_speed * 3.6),
    sunrise: d.sunrise,
    sunset: d.sunset,
  }));

  // For 30-day: use 16-day forecast endpoint (max available on free tier)
  let daily30: DailyForecast[] = [];
  try {
    const url30 = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=16&appid=${apiKey}&units=metric&lang=ru`;
    const r30 = await fetch(url30);
    if (r30.ok) {
      const raw30 = await r30.json() as any;
      daily30 = (raw30.list || []).map((d: any) => ({
        dt: d.dt,
        tempMin: Math.round(d.temp.min),
        tempMax: Math.round(d.temp.max),
        description: d.weather[0].description,
        icon: d.weather[0].icon,
        pop: Math.round((d.pop || 0) * 100),
        humidity: d.humidity,
        windSpeed: Math.round(d.speed * 3.6),
        sunrise: d.sunrise || 0,
        sunset: d.sunset || 0,
      }));
    }
  } catch (_) {}

  const data: WeatherData = { current, hourly, daily, daily30 };
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}

export async function fetchWeatherForCity(slug: string): Promise<WeatherData> {
  const city = GEORGIA_CITIES.find(c => c.slug === slug);
  if (!city) throw new Error(`City not found: ${slug}`);
  return fetchWeatherByCoords(city.lat, city.lon, city.nameRu, city.nameEn);
}

export function getCityBySlug(slug: string): CityInfo | undefined {
  return GEORGIA_CITIES.find(c => c.slug === slug);
}

export function getWeatherGradient(isDay: boolean, icon: string): string {
  const hour = new Date().getHours();
  if (icon.includes('01') || icon.includes('02')) {
    if (hour >= 5 && hour < 8) return 'from-orange-400 via-pink-400 to-purple-500';
    if (hour >= 8 && hour < 19) return 'from-sky-400 via-blue-500 to-blue-700';
    if (hour >= 19 && hour < 21) return 'from-orange-600 via-red-700 to-indigo-900';
    return 'from-indigo-900 via-blue-900 to-slate-900';
  }
  if (icon.includes('09') || icon.includes('10') || icon.includes('11')) return 'from-slate-600 via-slate-700 to-slate-900';
  if (icon.includes('13')) return 'from-blue-200 via-slate-300 to-blue-400';
  return isDay ? 'from-blue-400 via-blue-600 to-blue-800' : 'from-indigo-900 via-blue-900 to-slate-900';
}

export function getWindDirection(deg: number): string {
  const dirs = ['С', 'ССВ', 'СВ', 'ВСВ', 'В', 'ВЮВ', 'ЮВ', 'ЮЮВ', 'Ю', 'ЮЮЗ', 'ЮЗ', 'ЗЮЗ', 'З', 'ЗСЗ', 'СЗ', 'ССЗ'];
  return dirs[Math.round(deg / 22.5) % 16];
}

export function formatTime(unixTs: number, timezoneOffset: number): string {
  const date = new Date((unixTs + timezoneOffset) * 1000);
  return date.toUTCString().slice(17, 22);
}

export function formatDayName(unixTs: number): string {
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const date = new Date(unixTs * 1000);
  return days[date.getUTCDay()];
}

export function formatFullDayName(unixTs: number): string {
  const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const date = new Date(unixTs * 1000);
  return days[date.getUTCDay()];
}
