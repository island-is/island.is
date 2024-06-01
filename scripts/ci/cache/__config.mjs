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
import { ENV_KEYS, ENV_INIT_CACHE } from './_const.mjs'

// When testing this is good to manipulate
const HASH_VERSION = 1

export const enableNodeModules = process.env.ENABLE_NODE_MODULES === 'true'
export const enableMobileNodeModules =
  process.env.ENABLE_MOBILE_NODE_MODULES === 'true'
export const enableGeneratedFiles =
  process.env.ENABLE_GENERATED_FILES === 'true'
export const enableCypress = process.env.ENABLE_CYPRESS === 'true'
export const cypressPath = process.env.CYPRESS_PATH
export const keys = process.env[ENV_KEYS]
  ? JSON.parse(process.env[ENV_KEYS])
  : {}
export const cacheSuccess = JSON.parse(process.env.CACHE_SUCCESS ?? '{}')
export const initCache = process.env[ENV_INIT_CACHE] === 'true'

console.log({ keys })

if (enableCypress && !cypressPath) {
  throw new Error('Cypress path is not set')
}

export const caches = [
  {
    enabled: enableNodeModules,
    hash: async () =>
      keys['node-modules'] ??
      `node-modules-${HASH_VERSION}-${getPlatformString()}-${await getYarnLockHash()}-${await getPackageHash()}-${await getNodeVersionString()}`,
    name: 'Cache node_modules',
    id: 'node-modules',
    path: 'node_modules',
    check: async (success, path) => {
      if (!success) {
        return false
      }
      return folderSizeIsEqualOrGreaterThan(path, 1000)
    },
    init: async () => {
      const path = resolve(ROOT, './scripts/ci/10_prepare-host-deps.sh')
      await runCommand(path, ROOT)
    },
  },
  {
    enabled: enableMobileNodeModules,
    hash: async () =>
      keys['mobile-node-modules'] ??
      `app-node-modules-${HASH_VERSION}-${getPlatformString()}-${await getYarnLockHash()}-${await getPackageHash(
        MOBILE_APP_DIR,
      )}-${await getNodeVersionString()}`,
    name: 'Cache Mobile node_modules',
    id: 'mobile-node-modules',
    path: 'apps/native/app/node_modules',
  },
  {
    enabled: enableGeneratedFiles,
    hash: async () =>
      keys['generated-files'] ??
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
    enabled: enableCypress,
    hash: async () =>
      keys['cypress-cache'] ??
      `cypress-cache-${HASH_VERSION}-${getPlatformString()}-${await getYarnLockHash()}-${await getPackageHash()}-${await getNodeVersionString()}`,
    name: 'Cache Cypress',
    id: 'cypress-cache',
    path: cypressPath || '',
  },
].filter((step) => step.enabled)
