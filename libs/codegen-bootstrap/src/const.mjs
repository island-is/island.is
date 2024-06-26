// @ts-check
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const __dirname = dirname(fileURLToPath(import.meta.url))
export const ROOT = resolve(__dirname, '..', '..', '..')
export const PROJECTDIR = resolve(__dirname, '..')
export const PROJECTJSON = resolve(PROJECTDIR, 'project.json')

// Schema file
export const SCHEMA_FILE = 'libs/api/schema/src/lib/schema.ts'
export const SCHEMA_PATH = resolve(ROOT, SCHEMA_FILE)
export const SCHEMA_CONTENT = 'export default () => {}'
