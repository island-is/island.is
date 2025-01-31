#!/usr/bin/env node
import { getPackageJSON } from './_common.mjs'

const nodeVersion = await getPackageVersion()

if (!version) {
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
}
