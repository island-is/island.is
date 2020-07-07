import { createCache } from '@island.is/cache'

import { environment } from '../environments'

const { redis, production } = environment

export default createCache({
  name: 'gjafakort-cache',
  nodes: redis.urls,
  ssl: production,
})
