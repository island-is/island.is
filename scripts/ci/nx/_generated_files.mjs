// @ts-check

import { resolve } from 'path'
import { ROOT } from './_common.mjs'
import { fileExists, runNxCommand } from './_utils.mjs'
import { writeFile } from 'fs/promises'

const SCHEMA_PATH = resolve(ROOT, 'libs/api/schema/src/lib/schema.ts')
const TARGETS = ['codegen/backend-schema', 'codegen/frontend-client']

export async function createGeneratedFiles() {
  if (!(await fileExists(SCHEMA_PATH))) {
    await writeFile(SCHEMA_PATH, 'export default () => {}')
  }
  for (const target of TARGETS) {
    console.log(`--> Running command for ${target}\n`)
    try {
      await runNxCommand(`run-many --target=${target} --all`)
    } catch (err) {
      console.log(err);
      process.exit(1)
    }
  }
}
