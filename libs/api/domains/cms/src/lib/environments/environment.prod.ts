export default {
  production: true,
  bypassCacheKey: process.env.BYPASS_CACHE_KEY,
  cacheTime: process.env.CACHE_TIME || 5,
  indexableTypes: ['article', 'lifeEventPage'],
  contentful: {
    space: process.env.CONTENTFUL_SPACE,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    environment: process.env.CONTENTFUL_ENVIRONMENT,
    host: process.env.CONTENTFUL_HOST,
  },
}
