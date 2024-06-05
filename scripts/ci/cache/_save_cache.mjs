// @ts-check

import { saveCache as _saveCache } from '@actions/cache'
import { ROOT } from './_common.mjs'
import { resolve } from 'node:path'

export async function saveCache({ key, path }) {
  let cache
  const paths = [path].map((e) => resolve(ROOT, e))
  try {
    cache = await _saveCache(paths, key, {}, true)
  } catch (e) {
    return false
  }
  console.log({ cache })
  return cache != undefined
}
