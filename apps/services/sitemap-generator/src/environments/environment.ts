let env = process.env

const isDevelopment = env.NODE_ENV === 'development'

if (!env.NODE_ENV || isDevelopment) {
  env = {
    SITEMAP_BASE_URL: 'http://localhost:4200',
    S3_BUCKET: 'island-is-sitemaps-dev',
    SITEMAP_UPDATE_INTERVAL_MINUTES: '30',
    CONTENTFUL_HOST: 'preview.contentful.com',
    ...env,
  }
}

const required = (name: string): string => env[name] ?? ''

export const environment = {
  sitemapBaseUrl: required('SITEMAP_BASE_URL'),
  s3Bucket: required('S3_BUCKET'),
  sitemapUpdateIntervalMinutes: parseInt(
    env.SITEMAP_UPDATE_INTERVAL_MINUTES ?? '60',
    10,
  ),
  contentful: {
    space: env.CONTENTFUL_SPACE || '8k0h54kbe6bj',
    accessToken: required('CONTENTFUL_ACCESS_TOKEN'),
    environment: env.CONTENTFUL_ENVIRONMENT || 'master',
    host: env.CONTENTFUL_HOST || 'preview.contentful.com',
  },
}

export type Config = typeof environment
