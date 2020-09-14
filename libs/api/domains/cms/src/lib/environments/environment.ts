export default {
  production: false,
  bypassCacheKey: process.env.BYPASS_CACHE_KEY,
  cacheTime: process.env.CACHE_TIME || 5,
}
