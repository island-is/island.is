// @ts-check
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
export const SCRIPTS_DIR = __dirname
export const ROOT = resolve(__dirname, '..', '..', '..')
