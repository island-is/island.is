// @ts-check

import { restoreCache as _restoreCache } from '@actions/cache'
import { resolve } from 'node:path'
import { ROOT } from './_common.mjs'
import { retry } from './_utils.mjs'

export async function restoreCache({ key, path }) {
  let cache
  console.log(`Restoring cache for ${key}`)
  if (!process.env.CI) {
    // For testing
    return false
  }
  const paths = (Array.isArray(path) ? path : [path]).map((e) =>
    resolve(ROOT, e),
  )
  try {
    cache = await retry(() => _restoreCache(paths, key, [], {}, true))
  } catch (e) {
    console.log(`Failed to restore cache for ${key}: ${e.message}`)
    return false
  }
  console.log(
    cache !== undefined
      ? `Restored cache for ${key}`
      : `Cache not found for ${key}`,
  )
  return cache != undefined
}
