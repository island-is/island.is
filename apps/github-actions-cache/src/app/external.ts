import { S3Client } from '@aws-sdk/client-s3'
import environment from '../environments/environment'
import { createCache } from '@island.is/cache'

const { redis, production } = environment
export const s3 = new S3Client()
export const cache = createCache({
  name: 'github-actions-cache',
  nodes: redis.urls,
  ssl: production,
})
