export default {
  production: true,
  bypassCacheKey: process.env.BYPASS_CACHE_KEY,
  cacheTime: process.env.CACHE_TIME || 5,
}
