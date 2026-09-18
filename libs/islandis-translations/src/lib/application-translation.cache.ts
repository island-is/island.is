export const APPLICATION_TRANSLATION_CACHE_PREFIX = 'app-translation:'

export const getApplicationTranslationCacheKey = (namespace: string): string =>
  `${APPLICATION_TRANSLATION_CACHE_PREFIX}${namespace}`
