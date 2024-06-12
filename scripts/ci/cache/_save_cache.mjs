// @ts-check

import { saveCache as _saveCache } from '@actions/cache'
import { ROOT } from './_common.mjs'
import { resolve } from 'node:path'

export async function saveCache({ key, path }) {
  let cache
  if (!process.env.CI) {
    // For testing
    return false
  }
  const paths = (Array.isArray(path) ? path : [path]).map((e) =>
    resolve(ROOT, e),
  )
  try {
    cache = await _saveCache(paths, key, {}, true)
  } catch (e) {
    return false
  }
  return cache != undefined
}
