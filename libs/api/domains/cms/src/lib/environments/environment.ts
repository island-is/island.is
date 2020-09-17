export default {
  production: false,
  bypassCacheKey: process.env.BYPASS_CACHE_KEY,
  cacheTime: process.env.CACHE_TIME || 5,
  indexableTypes: ['article', 'lifeEventPage', 'articleCategory', 'news'],
  contentful: {
    space: process.env.CONTENTFUL_SPACE || '8k0h54kbe6bj',
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || 'test',
    environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    host: process.env.CONTENTFUL_HOST || 'preview.contentful.com',
  },
}
