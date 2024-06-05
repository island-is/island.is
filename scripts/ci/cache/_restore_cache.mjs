// @ts-check

import { restoreCache as _restoreCache } from '@actions/cache'
import { resolve } from 'node:path'
import { ROOT } from './_common.mjs'

export async function restoreCache({ key, path }) {
  let cache
  const paths = [path].map((e) => resolve(ROOT, e))
  try {
    cache = await _restoreCache(paths, key, [], {}, true)
  } catch (e) {
    return false
  }
  console.log({ cache })
  return cache != undefined
}
