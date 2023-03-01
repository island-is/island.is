export const environment = {
  syncToken: process.env.API_CMS_SYNC_TOKEN ?? '',
  deletionToken: process.env.API_CMS_DELETION_TOKEN ?? '',
  lockTime: 1800,
  locales: ['is', 'en'],
}
