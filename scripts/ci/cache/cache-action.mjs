/**
 * This script is used to generate a cache workflow for a CI/CD pipeline.
 */

// @ts-check
import { resolve } from 'node:path'
import { ENABLED_MODULES, caches } from './__config.mjs'
import { HAS_HASH_KEYS, ROOT } from './_common.mjs'
import { writeToSummary, writeToOutput } from './_get_hashes_utils.mjs'
import { keyStorage } from './_key_storage.mjs'
import { restoreCache } from './_restore_cache.mjs'
import { saveCache } from './_save_cache.mjs'
import { arrayIncludesOneOf, sleep, tryRun } from './_utils.mjs'
import { ENV_ENABLED_CACHE } from './_const.mjs'

if (Object.keys(ENABLED_MODULES).length === 0) {
  throw new Error(`No cache modules enabled, set env key ${ENV_ENABLED_CACHE}`)
}

const invalidModules = Object.keys(ENABLED_MODULES).filter((e) => {
  return caches.find((c) => c.id === e) == null
})

if (invalidModules.length > 0) {
  throw new Error(`Invalid modules ${invalidModules.join(', ')}`)
}

console.log(`Enabled modules ${caches.map((e) => e.name).join(', ')}`)
if (!HAS_HASH_KEYS) {
  console.log('Generating cache hashes')
}
/** Generate hash */
for (const value of caches) {
  if (value.enabled && !HAS_HASH_KEYS) {
    console.log(`Generating hash for ${value.name}`)
    keyStorage.setKey(value.id, await value.hash())
    console.log(`Hash for ${value.name} is ${keyStorage.getKey(value.id)}`)
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
await writeToOutput(keyStorage.getKeys())

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
        ...value,
        name: value.name,
        id: value.id,
        dependsOn: value.dependsOn,
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
    return {
      ...value,
      restoreSuccess,
    }
  }),
)

const checkCache = await Promise.all(
  restoreJobs.map(async (e) => {
    const isOk = e.check
      ? await e.check(
          e.restoreSuccess,
          Array.isArray(e.path)
            ? e.path.map((e) => resolve(ROOT, e))
            : resolve(ROOT, e.path),
        )
      : e.restoreSuccess
    if (isOk) {
      console.log(`Restored cache for ${e.name}`)
      if (e.post) {
        await tryRun(e.post, e.name, [resolve(ROOT, e.path)])
      }
    }
    return {
      ...e,
      isOk,
    }
  }),
)

const failedJobs = []
const succesFullJobs = []

for (const cache of checkCache) {
  if (!cache.isOk) {
    if (
      (cache.dependsOn &&
        arrayIncludesOneOf(
          failedJobs.map((e) => e.name),
          cache.dependsOn,
        )) ||
      HAS_HASH_KEYS
    ) {
      console.error(`Failed restoring cache for ${cache.name}`)
      failedJobs.push(cache)
      continue
    }

    const fileName = Array.isArray(cache.path)
      ? cache.path.map((e) => resolve(ROOT, e))
      : resolve(ROOT, cache.path)
    console.log(
      `Failed restoring cache for ${cache.name}, trying to init and save`,
    )
    const successInit = await tryRun(cache.init, cache.name, [fileName])
    const success = await (async () => {
      try {
        const value = await cache.check(successInit, fileName)
        return value
      } catch (e) {
        console.error(e)
        return false
      }
    })()
    if (!success) {
      console.log(`Failed init and check for ${cache.name}`)
      failedJobs.push(cache)
    } else {
      if (cache.post) {
        await tryRun(cache.post, cache.name, [fileName])
      }
      const saveSuccess = await saveCache({
        key: cache.key,
        path: cache.path,
      })
      if (!saveSuccess) {
        console.error(`Failed saving cache for ${cache.name}`)
        failedJobs.push(cache)
      } else {
        console.log(`Saved cache ${cache.name}`)
        succesFullJobs.push(cache.id)
        if (cache.post) {
          await tryRun(cache.post, cache.name, [fileName])
        }
      }
    }
  }
}

if (failedJobs.length > 0) {
  console.log('Failed caches: ', failedJobs.map((e) => e.id).join(', '))
  process.exit(1)
} else {
  console.log('All caches are restored successfully')
  // Kill all promiseses we don't need
  process.exit(0)
}
