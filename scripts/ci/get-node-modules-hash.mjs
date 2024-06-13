#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { arch, platform } from 'os'
import crypto from 'node:crypto'

import { ROOT, getPackageJSON } from './_common.mjs'

process.stdout.write(
  `${getPlatformString()}-${await getYarnLockHash()}-${await getPackageHash()}-${await getNodeVersionString()}`,
)

async function getNodeVersionString() {
  const content = await getPackageJSON()
  const nodeVersion = content?.engines?.node
  const yarnVersion = content?.engines?.yarn
  if (!nodeVersion) {
    throw new Error('Node version not defined')
  }
  if (!yarnVersion) {
    throw new Error('Yarn version not defined')
  }

  return `${nodeVersion}-${yarnVersion}`
}

function getPlatformString() {
  return `${platform()}-${arch()}`
}

async function getPackageHash(
  keys = ['resolutions', 'dependencies', 'devDependencies'],
) {
  const content = await getPackageJSON()
  const value = keys.reduce((a, b) => {
    return {
      ...a,
      [b]: content[b],
    }
  }, {})
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')
}

async function getYarnLockHash(
  root = ROOT,
  filePath = resolve(root, 'yarn.lock'),
) {
  const content = await readFile(filePath, 'utf-8')
  return crypto.createHash('sha256').update(content).digest('hex')
}
