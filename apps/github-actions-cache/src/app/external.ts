import { S3 } from 'aws-sdk'
import environment from '../environments/environment'
import { createCache } from '@island.is/cache'

const { redis, production } = environment
export const s3 = new S3({ region: 'eu-west-1' })
export const cache = createCache({
  name: 'github-actions-cache',
  nodes: redis.urls,
  ssl: production,
})
