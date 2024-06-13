// @ts-check

import { restoreCache as _restoreCache } from '@actions/cache'
import { resolve } from 'node:path'
import { ROOT } from './_common.mjs'
import { retry } from './_utils.mjs'

export async function restoreCache({ key, path }) {
  let cache
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
    return false
  }
  return cache != undefined
}
