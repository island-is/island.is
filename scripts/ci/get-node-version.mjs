#!/usr/bin/env node
// @ts-check
import { getPackageJSON } from './_common.mjs'

const nodeVersion = await getPackageVersion()
const majorOnly = true

if (!nodeVersion) {
  console.error(`Failed getting docker image for ${nodeVersion}`)
  process.exit(1)
}
process.stdout.write(nodeVersion)

async function getPackageVersion() {
  const content = await getPackageJSON()
  const version = content.engines?.node
  if (!version) {
    throw new Error(`Cannot find node version`)
  }
  return version
    .split('.')
    .slice(0, majorOnly ? 1 : 3)
    .join('.')
}
