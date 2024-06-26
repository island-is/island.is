// @ts-check
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const __dirname = dirname(fileURLToPath(import.meta.url))
export const ROOT = resolve(__dirname, '..', '..', '..')
export const PROJECTDIR = resolve(__dirname, '..')
export const PROJECTJSON = resolve(PROJECTDIR, 'project.json')

// Post codegen
export const POST_TARGETS = [
  'codegen/backend-schema',
  'codegen/backend-client',
  'codegen/frontend-client',
]
export const IGNORE_PROJECTS = ['codegen-backend-post', 'codegen-post']
