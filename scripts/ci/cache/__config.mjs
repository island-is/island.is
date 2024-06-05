// @ts-check
import { resolve } from 'path'
import { MOBILE_APP_DIR, ROOT } from './_common.mjs'
import {
  getPlatformString,
  getYarnLockHash,
  getPackageHash,
  getNodeVersionString,
  getGeneratedFileHash,
  folderSizeIsEqualOrGreaterThan,
  runCommand,
  fileSizeIsEqualOrGreaterThan,
} from './_utils.mjs'

import { ENV_INIT_CACHE, ENV_ENABLED_CACHE } from './_const.mjs'
import { keyStorage } from './_key_storage.mjs'

// When testing this is good to manipulate
const HASH_VERSION = 1

export const ENABLED_MODULES = (process.env[ENV_ENABLED_CACHE] || '')
  .split(',')
  .map((x) => x.trim())
  .filter((x) => x.length > 0)
  .reduce((a, b) => {
    a[b] = true
    return a
  }, {})

export const cypressPath = process.env.CYPRESS_CACHE_PATH
export const cacheSuccess = JSON.parse(process.env.CACHE_SUCCESS ?? '{}')
export const initCache = process.env[ENV_INIT_CACHE] === 'true'

if (Object.keys(ENABLED_MODULES).length === 0) {
  throw new Error('No cache modules enabled')
}

if (ENABLED_MODULES['cypress'] && !cypressPath) {
  throw new Error('Cypress path is not set')
}

export const caches = [
  {
    enabled: ENABLED_MODULES['node_modules'],
    hash: async () =>
      keyStorage.getKey('node_modules') ??
      `node-modules-${HASH_VERSION}-${getPlatformString()}-${await getYarnLockHash()}-${await getPackageHash()}-${await getNodeVersionString()}`,
    name: 'Cache node_modules',
    id: 'node_modules',
    path: 'node_modules',
    check: async (success, path) => {
      if (!success) {
        return false
      }
      return folderSizeIsEqualOrGreaterThan(path, 1000)
    },
    init: async () => {
      const path = resolve(ROOT, './scripts/ci/10_prepare-host-deps.sh')
      try {
        await runCommand(path, ROOT)
      } catch {
        return false
      }
      return true
    },
  },
  {
    enabled: ENABLED_MODULES['mobile-node_modules'],
    hash: async () =>
      keyStorage.getKey('mobile-node_modules') ??
      `app-node-modules-${HASH_VERSION}-${getPlatformString()}-${await getYarnLockHash()}-${await getPackageHash(
        MOBILE_APP_DIR,
      )}-${await getNodeVersionString()}`,
      check: async (success, path) => {
        if (!success) {
          return false
        }
        return folderSizeIsEqualOrGreaterThan(path, 1000)
      },
      init: async () => {
        try {
          const yarnLockRoot = resolve(ROOT, 'yarn.lock')
          const yarnLock = resolve(MOBILE_APP_DIR, 'yarn.lock')
          await runCommand(`cp "${yarnLockRoot}" "${yarnLock}"`, ROOT)
          await runCommand('yarn install --immutable', MOBILE_APP_DIR)
          await runCommand(`rm "${yarnLock}"`, MOBILE_APP_DIR)
        } catch {
          return false
        }
        return true
      },
    name: 'Cache Mobile node_modules',
    id: 'mobile-node_modules',
    path: 'apps/native/app/node_modules',
  },
  {
    enabled: ENABLED_MODULES['generated-files'],
    hash: async () =>
      keyStorage.getKey('generated-files') ??
      `generated-files-${HASH_VERSION}-${getPlatformString()}-${await getGeneratedFileHash()}`,
    name: 'Cache Generated Files',
    id: 'generated-files',
    path: 'generated_files.tar.gz',
    check: async (success, path) => {
      if (!success) {
        return false
      }
      return fileSizeIsEqualOrGreaterThan(path, 1000)
    },
    init: async (path) => {
      const cmd = `tar zcvf ${path} $(./scripts/ci/get-files-touched-by.sh yarn codegen --skip-cache | xargs realpath --relative-to ${ROOT})`
      await runCommand(cmd, ROOT)
    },
  },
  {
    enabled: ENABLED_MODULES['cypress'],
    hash: async () =>
      keyStorage.getKey('cypress') ??
      `cypress-cache-${HASH_VERSION}-${getPlatformString()}-${await getYarnLockHash()}-${await getPackageHash()}-${await getNodeVersionString()}`,
    name: 'Cache Cypress',
    id: 'cypress',
    path: cypressPath || '',
  },
].filter((step) => step.enabled)
