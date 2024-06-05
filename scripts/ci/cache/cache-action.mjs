/**
 * This script is used to generate a cache workflow for a CI/CD pipeline.
 */

// @ts-check
import { resolve } from 'node:path'
import { caches } from './__config.mjs'
import { HAS_HASH_KEYS, ROOT } from './_common.mjs'
import { writeToSummary, writeToOutput } from './_get_hashes_utils.mjs'
import { keyStorage } from './_key_storage.mjs'
import { restoreCache } from './_restore_cache.mjs'
import { saveCache } from './_save_cache.mjs'

if (!HAS_HASH_KEYS) {
  console.log('Generating cache hashes')
}
/** Generate hash */
for (const value of caches) {
  if (value.enabled && !HAS_HASH_KEYS) {
    console.log(`Generating hash for ${value.name}`)
    keyStorage.setKey(value.id, await value.hash())
  }
  if (!value.enabled && HAS_HASH_KEYS && keyStorage.hasKey(value.id)) {
    // Delete key if not enabled
    keyStorage.deleteKey(value.id)
  }
}
if (!HAS_HASH_KEYS) {
  // Only write summary if this is initial run
  await writeToSummary(keyStorage.getKeys())
}
writeToOutput(keyStorage.getKeys())

/**
 * @type {any[]}
 */
const steps = [
  ...(await Promise.all(
    caches.map(async (value) => {
      if (!value.enabled) {
        return null
      }
      return {
        name: value.name,
        id: value.id,
        path: value.path,
        key: await value.hash(),
        init: value.init,
        check: value.check,
      }
    }),
  )),
].filter((e) => e != null)

// Restore cache
const restoreJobs = await Promise.all(
  steps.map(async (value) => {
    const restoreSuccess = await restoreCache({
      key: value.key,
      path: value.path,
    })
    console.log({ restoreSuccess })
    return {
      ...value,
      restoreSuccess,
    }
  }),
)

const checkCache = await Promise.all(
  restoreJobs.map(async (e) => {
    const isOk = e.check
      ? await e.check(e.restoreSuccess, resolve(ROOT, e.path))
      : e.restoreSuccess
    console.log({ isOk })
    return {
      ...e,
      isOk,
    }
  }),
)

const failedJobs = []

await Promise.all(
  checkCache.map(async (cache) => {
    if (!cache.isOk) {
      if (HAS_HASH_KEYS) {
        console.error(`Failed restoring cache for ${cache.name}`)
        failedJobs.push(cache)
        return
      }
      console.log(
        `Failed restoring cache for ${cache.name}, trying to init and save`,
      )
      const fileName = resolve(ROOT, cache.path)
      const successInit = await cache.init()
      const success = await cache.check(successInit, fileName)
      if (!success) {
        failedJobs.push(cache)
      } else {
        const saveSuccess = await saveCache({
          key: cache.key,
          path: cache.path,
        })
        if (!saveSuccess) {
          console.error(`Failed saving cache for ${cache.name}`)
          failedJobs.push(cache)
        }
      }
    }
  }),
)

if (failedJobs.length > 0) {
  console.log('Failed caches: ', failedJobs.map((e) => e.id).join(', '))
  process.exit(1)
}
console.log('All caches are restored successfully')

// Kill all promiseses we don't need
process.exit(0)
