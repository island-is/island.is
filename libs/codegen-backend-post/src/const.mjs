// @ts-check
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const __dirname = dirname(fileURLToPath(import.meta.url))
export const ROOT = resolve(__dirname, '..', '..', '..')
export const PROJECTDIR = resolve(__dirname, '..')
export const PROJECTJSON = resolve(PROJECTDIR, 'project.json')

// Post backend
export const POST_BACKEND_TARGETS = [
  'codegen/backend-schema',
  'codegen/backend-client',
]
export const IGNORE_PROJECTS = ['codegen-backend-post', 'codegen-post']
