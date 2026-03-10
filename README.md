# 🌦 Pagoda.ge — Пагода Грузия

Сайт прогноза погоды для всех городов и курортов Грузии на русском языке.

## 🛠 Tech Stack

- **Framework**: Astro 4 (SSR / hybrid mode)
- **Styling**: Tailwind CSS
- **Data**: OpenWeatherMap One Call API 3.0
- **Deployment**: Cloudflare Pages
- **Language**: TypeScript

## 📁 Project Structure

```
pagoda-ge/
├── src/
│   ├── lib/
│   │   ├── weather.ts       # All weather fetching + caching logic
│   │   └── seo.ts           # SEO metadata helpers
│   ├── layouts/
│   │   └── BaseLayout.astro # Global layout: nav, footer, meta tags
│   ├── components/
│   │   ├── WeatherCard.astro # Current + hourly + 7d + 30d display
│   │   ├── CityGrid.astro   # City selection grid
│   │   └── FAQ.astro        # FAQ section (Schema.org structured data)
│   └── pages/
│       ├── index.astro      # Homepage (Tbilisi default + search)
│       ├── [city].astro     # Dynamic city pages: /pagoda-batumi etc.
│       └── blog/
│           ├── index.astro
│           ├── luchshee-vremya-dlya-gruzii.astro
│           ├── pogoda-v-gudauri-zima.astro
│           └── klimat-gruzii-po-mestam.astro
└── public/
    ├── favicon.svg
    ├── robots.txt
    └── sitemap.xml
```

## 🔐 Environment Variables (IMPORTANT — Security)

### Local Development

1. Copy `.env.example` → `.env`
2. Add your API key:
```
OPENWEATHER_API_KEY=your_api_key_here
```

### Cloudflare Pages Production

1. Go to **Cloudflare Dashboard** → Pages → your project
2. **Settings** → **Environment Variables**
3. Click **Add variable**:
   - Variable name: `OPENWEATHER_API_KEY`
   - Value: your OpenWeatherMap API key
4. Set for both **Production** and **Preview** environments
5. Save and redeploy

The key is accessed in code via `import.meta.env.OPENWEATHER_API_KEY` — it is NEVER hardcoded.

## 🕐 Day/Night Logic

The day/night UI gradient is determined by comparing the current Unix timestamp against the `sunrise` and `sunset` values returned by the OWM API. All times are in UTC — the API also provides `timezone_offset` to convert to local Georgia time (UTC+4):

```typescript
const localTime = currentDt + timezoneOffset;
const isDay = currentDt > sunrise && currentDt < sunset;
```

Dynamic gradients switch automatically:
- Dawn (5–8am): orange/pink → purple
- Day (8am–7pm): sky blue → deep blue
- Dusk (7–9pm): orange → red → indigo
- Night: deep indigo → slate

## ⚡ Caching Strategy

10-minute in-memory cache (`Map<string, CacheEntry>`) per city coordinates prevents hitting the OWM rate limit on repeated page visits. Since Cloudflare Workers are stateless (each request may hit a new isolate), the cache is per-process but still effective for burst traffic.

For production with high traffic, consider:
- Cloudflare KV for distributed caching
- Cloudflare Cache API for HTTP caching

## 🚀 Deploy to Cloudflare Pages

```bash
# Install dependencies
npm install

# Build
npm run build

# Preview locally
npm run preview
```

Connect your GitHub repo to Cloudflare Pages:
1. Build command: `npm run build`
2. Build output directory: `dist`
3. Node.js version: 18+

## 🗺 City URLs

All 20 city pages follow the pattern `/pagoda-{slug}`:

| City | URL |
|------|-----|
| Тбилиси | /pagoda-tbilisi |
| Батуми | /pagoda-batumi |
| Гудаури | /pagoda-gudauri |
| Местиа | /pagoda-mestia |
| Боржоми | /pagoda-borjomi |
| ... | /pagoda-{slug} |

## 🔑 Target Keywords

**Homepage:**
- пагода грузия
- пагода
- пагода в грузии
- пагода 7 дней
- пагода в тбилиси

**City pages:** Same pattern with city name, e.g.:
- пагода батуми
- пагода в батуми
- пагода батуми 7 дней

## 📊 SEO Features

- `<title>`, `<meta description>`, `<meta keywords>` on every page
- Canonical URLs
- Open Graph + Twitter Card meta tags
- `Schema.org` JSON-LD: WebSite + BreadcrumbList + FAQPage
- `sitemap.xml` with all 20+ city URLs
- `robots.txt`
- Russian language (`lang="ru"`, `og:locale="ru_RU"`)
- Semantic HTML5 structure
- FAQ structured data on every page
