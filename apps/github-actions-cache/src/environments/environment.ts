const production = process.env.NODE_ENV === 'production'
const REDIS_NODES =
  process.env.REDIS_NODES ||
  (!production &&
    'localhost:7000,localhost:7001,localhost:7002,localhost:7003,localhost:7004,localhost:7005') ||
  undefined

export default {
  production,
  bucket: process.env.AWS_S3_CACHE_BUCKET || 'island-is-github-cache-dev',
  redis: {
    urls: REDIS_NODES!.split(','),
  },
}
