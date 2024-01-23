import { writeFileSync } from 'fs'
import { dirname, resolve } from 'path'

const root = resolve(__dirname, '..')
const mainRoot = resolve(root, '..')

const rootPackageJson = require(resolve(root, 'package.json'))
const mainPackageJson = require(resolve(mainRoot, 'package.json'))

let changed = false
// Update dependencies
Object.keys(rootPackageJson.dependencies).forEach((key) => {
  if (!mainPackageJson.dependencies[key]) {
    // Empty on purpose
  } else if (
    rootPackageJson.dependencies[key] !== mainPackageJson.dependencies[key]
  ) {
    changed = true
    rootPackageJson.dependencies[key] = mainPackageJson.dependencies[key]
  }
})

Object.keys(rootPackageJson.devDependencies).forEach((key) => {
  if (!mainPackageJson.devDependencies[key]) {
    // Empty on purpose
  } else if (
    rootPackageJson.devDependencies[key] !==
    mainPackageJson.devDependencies[key]
  ) {
    changed = true
    rootPackageJson.devDependencies[key] = mainPackageJson.devDependencies[key]
  }
})

if (changed) {
  console.log(`Updating dependencies`)
  writeFileSync(
    resolve(root, 'package.json'),
    JSON.stringify(rootPackageJson, null, 2),
  )
  console.log('Please run yarn again')
  process.exit(1)
}
