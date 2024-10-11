// @ts-check
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { ENV_KEYS } from './_const.mjs'
const __dirname = dirname(fileURLToPath(import.meta.url))
export const SCRIPTS_DIR = __dirname
export const ROOT = resolve(__dirname, '..', '..', '..')
export const MOBILE_APP_DIR = resolve(ROOT, ...'apps/native/app'.split('/'))
export const HAS_HASH_KEYS = !!(
  process.env[ENV_KEYS] && process.env[ENV_KEYS] != 'false'
)
