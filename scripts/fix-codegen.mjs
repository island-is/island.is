// @ts-check

import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const __dirname = dirname(fileURLToPath(import.meta.url))
export const ROOT = resolve(__dirname, '..')
const projects = ['libs/codegen-backend-post', 'libs/codegen-post']

let changeNeeded = false

for (const project of projects) {
  const projectRoot = resolve(ROOT, project)
  const projectJsonLocation = resolve(projectRoot, 'project.json')
  const json = JSON.parse(await readFile(projectJsonLocation, 'utf-8'))
  const currentPackages = json.implicitDependencies || []
  const projectJsonListScript = resolve(projectRoot, 'src/get-list.mjs')
  const requiredPackages = await (
    await import(projectJsonListScript)
  ).getProjectList()
  if (currentPackages.sort().join(',') != requiredPackages.sort().join(',')) {
    changeNeeded = true
    console.log(`Updating ${projectJsonLocation}`)
    json.implicitDependencies = requiredPackages
    await writeFile(projectJsonLocation, JSON.stringify(json, null, 2))
  }
}

if (changeNeeded) {
  process.exit(1)
}
console.log(`No changes needed.`)
