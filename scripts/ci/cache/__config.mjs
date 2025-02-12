// @ts-check
import { resolve } from 'path'
import { MOBILE_APP_DIR, ROOT } from './_common.mjs'
import {
  getPlatformString,
  getYarnLockHash,
  getPackageHash,
  getNodeVersionString,
  folderSizeIsEqualOrGreaterThan,
  runCommand,
  fileSizeIsEqualOrGreaterThan,
  getPackageJSON,
  getFilesHash,
} from './_utils.mjs'

import {
  ENV_INIT_CACHE,
  ENV_ENABLED_CACHE,
  ENV_CACHE_SUCCESS,
} from './_const.mjs'
import { keyStorage } from './_key_storage.mjs'
import { getGeneratedFilesHash } from './_generated_files.mjs'

// When testing this is good to manipulate
const HASH_VERSION = `newcache-${7}`

export const ENABLED_MODULES = (process.env[ENV_ENABLED_CACHE] || '')
  .split(',')
  .map((x) => x.trim())
  .filter((x) => x.length > 0)
  .reduce((a, b) => {
    a[b] = true
    return a
  }, {})

// Override default Cypress cache; the default (~/.cache) could be unwritable
export const cypressPath =
  process.env.CYPRESS_CACHE_FOLDER || `${process.env.HOME}/.cypress-cache`
export const cacheSuccess = JSON.parse(process.env[ENV_CACHE_SUCCESS] ?? '{}')
export const initCache = process.env[ENV_INIT_CACHE] === 'true'

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
      await runCommand(path, ROOT)
    },
  },
  {
    enabled: ENABLED_MODULES['mobile-node_modules'],
    hash: async () =>
      keyStorage.getKey('mobile-node_modules') ??
      `mobile-node-modules-${HASH_VERSION}-${getPlatformString()}-${await getYarnLockHash()}-${await getPackageHash(
        MOBILE_APP_DIR,
      )}-${await getNodeVersionString()}`,
    check: async (success, path) => {
      if (!success) {
        return false
      }
      return folderSizeIsEqualOrGreaterThan(path, 1000)
    },
    init: async () => {
      const yarnLockRoot = resolve(ROOT, 'yarn.lock')
      const yarnLock = resolve(MOBILE_APP_DIR, 'yarn.lock')
      await runCommand(`cp ${yarnLockRoot} ${yarnLock}`, ROOT)
      await runCommand('yarn install', MOBILE_APP_DIR)
      await runCommand(`rm ${yarnLock}`, MOBILE_APP_DIR)
    },
    name: 'Cache Mobile node_modules',
    id: 'mobile-node_modules',
    path: 'apps/native/app/node_modules',
  },
  {
    enabled: ENABLED_MODULES['generated-files'],
    hash: async () =>
      keyStorage.getKey('generated-files') ??
      `generated-files-${HASH_VERSION}-${getPlatformString()}-${await getYarnLockHash()}-${await getPackageHash()}-${await getGeneratedFilesHash()}`,
    name: 'Cache Generated Files',
    id: 'generated-files',
    path: 'generated_files.tar.gz',
    dependsOn: ['node_modules', 'mobile-node_modules'],
    check: async (success, path) => {
      if (!success) {
        return false
      }
      return fileSizeIsEqualOrGreaterThan(path, 1000)
    },
    post: async () => {
      await runCommand(`tar zxvf generated_files.tar.gz`, ROOT)
    },
    init: async (path) => {
      console.log(`Generating files to ${path} - THIS WILL TAKE A LOT OF TIME`)
      const script = resolve(ROOT, 'scripts/ci/cache/generate-files.sh')
      await runCommand(`${script}`, ROOT)
    },
  },
  {
    enabled: ENABLED_MODULES['docker'],
    dependsOn: ['node_modules', 'mobile-node_modules', 'generated-files'],
    hash: async () => {
      const files = [
        'scripts/ci/10_prepare-docker-deps.sh',
        'scripts/ci/Dockerfile',
        'scripts/ci/_common.mjs',
      ].map((file) => resolve(ROOT, file))
      const filesHash = getFilesHash(files)
      return `docker-${HASH_VERSION}-${getPlatformString()}-${await getYarnLockHash()}-${await getPackageHash()}-${await getNodeVersionString()}-${filesHash}`
    },
    name: 'Cache Docker',
    path: ['cache', 'cache_output'],
    id: 'docker',
    init: async () => {
      const path = resolve(ROOT, './scripts/ci/10_prepare-docker-deps.sh')
      await runCommand(path, ROOT)
    },
    check: async (success, path) => {
      if (!success) {
        return false
      }
      const successCheck = (
        await Promise.all(
          path.map(async (p) => {
            return await folderSizeIsEqualOrGreaterThan(p, 1000)
          }),
        )
      ).every((x) => x)
      return successCheck
    },
  },
  {
    enabled: ENABLED_MODULES['cypress'],
    hash: async () => {
      if (keyStorage.getKey('cypress')) {
        return keyStorage.getKey('cypress')
      }
      const pkg = await getPackageJSON()
      const cypressVersion = pkg?.devDependencies?.cypress
      return `cypress-cache-${HASH_VERSION}-${getPlatformString()}-${cypressVersion}-2`
    },
    name: 'Cache Cypress',
    id: 'cypress',
    check: async (success, _path) => {
      if (!success) {
        return false
      }
      try {
        await runCommand('npx cypress verify', ROOT)
      } catch {
        return false
      }
      return true
    },
    init: async () => {
      const pkg = await getPackageJSON()
      const cypressVersion = pkg?.devDependencies?.cypress
      await runCommand('npx cypress install', ROOT, {
        CYPRESS_INSTALL_BINARY: cypressVersion,
        CYPRESS_CACHE_FOLDER: cypressPath,
      })
    },
    path: cypressPath || '',
  },
].filter((step) => step.enabled)
