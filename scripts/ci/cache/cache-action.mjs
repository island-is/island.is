import { resolve } from 'path'
import { cacheSuccess, caches, initCache } from './config.mjs'

const enabledCaches = caches.filter((value) => value.enabled)

for (const cache of enabledCaches) {
  const fileName = resolve(ROOT, cache.fileName)
  const isOkay = await cache.check(cacheSuccess[cache.id] === 'true', fileName)
  if (!isOkay) {
    if (!initCache) {
      throw new Error(`Cache ${cache.name} is not valid`)
    }
    await cache.init(fileName)
  }
}
