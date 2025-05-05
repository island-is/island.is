const production = process.env.NODE_ENV === 'production'
const REDIS_NODES =
  process.env.REDIS_NODES ||
  (!production &&
    'localhost:7010,localhost:7011,localhost:7012,localhost:7013,localhost:7014,localhost:7015') ||
  undefined

export default {
  production,
  bucket: process.env.AWS_S3_CACHE_BUCKET || 'island-is-github-cache-dev',
  redis: {
    urls: REDIS_NODES!.split(','),
  },
}
