import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
export const SCRIPTS_DIR = __dirname
export const ROOT = resolve(__dirname, '..', '..')
export const MOBILE_APP_DIR = resolve(ROOT, ...'apps/native/app'.split('/'))
export async function getPackageJSON(
  root = ROOT,
  filePath = resolve(ROOT, 'package.json'),
) {
  const content = JSON.parse(await readFile(filePath, 'utf-8'))
  return content
}
