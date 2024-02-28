export const environment = {
  syncToken: process.env.API_CMS_SYNC_TOKEN ?? '',
  deletionToken: process.env.API_CMS_DELETION_TOKEN ?? '',
  lockTime: 30 * 60, // 30 minutes
  locales: ['is', 'en'],
  bypassCacheSecret: process.env.APOLLO_BYPASS_CACHE_SECRET ?? '',
  runtimeEnvironment: process.env.ENVIRONMENT ?? 'local',
}
