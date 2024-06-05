// @ts-check
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { ENV_HASHES_KEY } from './_const.mjs'
process.env["ACTIONS_CACHE_URL"] = "https://cache.dev01.devland.is/";
const __dirname = dirname(fileURLToPath(import.meta.url))
export const SCRIPTS_DIR = __dirname
export const ROOT = resolve(__dirname, '..', '..', '..')
export const MOBILE_APP_DIR = resolve(ROOT, ...'apps/native/app'.split('/'))
export const HAS_HASH_KEYS = !!(
  process.env[ENV_HASHES_KEY] && process.env[ENV_HASHES_KEY] != 'false'
)
