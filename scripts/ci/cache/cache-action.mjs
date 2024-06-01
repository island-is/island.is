// @ts-check
import { resolve } from 'path'
import { cacheSuccess, caches, initCache } from './config.mjs'
import { ROOT } from './_common.mjs'

const enabledCaches = caches.filter((value) => value.enabled)

for (const cache of enabledCaches) {
  const fileName = resolve(ROOT, cache.fileName)
  const isOkay = cache.check ?  await cache.check(cacheSuccess[cache.id] === 'true', fileName) : cacheSuccess[cache.id] === 'true'
  if (!isOkay) {
    if (!initCache) {
      throw new Error(`Cache ${cache.name} is not valid`)
    }
    if (cache.init) {
      console.log(`Init cache ${cache.name}`)
      await cache.init()
    }
  }
}
