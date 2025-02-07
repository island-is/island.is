#!/usr/bin/env node
import { getPackageJSON } from './_common.mjs'

const onlyMajor = true
const version = await getPackageVersion({ onlyMajor })

if (!version) {
  console.error(`Failed getting docker image for ${nodeVersion}`)
  process.exit(1)
}
process.stdout.write(version)

async function getPackageVersion({ onlyMajor = false } = {}) {
  const content = await getPackageJSON()
  const version = content.engines?.node
  if (!version) {
    throw new Error(`Cannot find node version`)
  }
  return version
    .split('.')
    .slice(0, onlyMajor ? 1 : 3)
    .join('.')
}
