// @ts-check
import { arch, platform } from 'node:os'
import crypto from 'node:crypto'
import { ROOT } from './_common.mjs'
import { exec } from 'node:child_process'
import { resolve, join } from 'node:path'
import { readFile, readdir, stat } from 'node:fs/promises'
import { HASH_GENERATE_FILES_SCRIPT } from './_const.mjs'

const GENERATE_HASH_GENERATED_FILES_SCRIPT = resolve(
  ROOT,
  ...HASH_GENERATE_FILES_SCRIPT.split('/'),
)
export async function getGeneratedFileHash(
  scriptPath = GENERATE_HASH_GENERATED_FILES_SCRIPT,
) {
  return new Promise((resolve, reject) => {
    exec(`bash "${scriptPath}"`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`)
        return
      }
      if (stderr) {
        reject(`Stderr: ${stderr}`)
        return
      }
      resolve(stdout)
    })
  })
}
export async function getNodeVersionString() {
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
export function getPlatformString() {
  return `${platform()}-${arch()}`
}
export async function getPackageHash(
  root = ROOT,
  keys = ['resolutions', 'dependencies', 'devDependencies'],
) {
  const content = await getPackageJSON(root)
  const value = keys.reduce((a, b) => {
    return {
      ...a,
      [b]: content[b],
    }
  }, {})
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')
}
/**
 * Calculates the SHA256 hash of the content of a yarn.lock file.
 * @param {string} [root=ROOT] - The root directory of the project.
 * @param {string} [filePath] - The path to the yarn.lock file.
 * @returns {Promise<string>} The SHA256 hash of the yarn.lock file content.
 */
export async function getYarnLockHash(
  root = ROOT,
  filePath = resolve(root, 'yarn.lock'),
) {
  const content = await readFile(filePath, 'utf-8')
  return crypto.createHash('sha256').update(content).digest('hex')
}

/**
 * Checks if the file size is equal to or greater than the specified size.
 *
 * @param {string} filePath - The path to the file.
 * @param {number} size - The size to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to true if the file size is equal to or greater than the specified size, otherwise false.
 * @throws {Error} - If there is an error getting the file size.
 */
export async function fileSizeIsEqualOrGreaterThan(filePath, size) {
  try {
    const stats = await stat(filePath)
    return stats.size >= size
  } catch (err) {
    throw new Error(`Error getting file size: ${err.message}`)
  }
}

/**
 * Calculates the total size of a folder and checks if it is equal to or greater than a specified size.
 * @param {string} folderPath - The path to the folder.
 * @param {number} size - The size to compare against.
 * @param {boolean} [number=false] - Optional flag to return the total size as a number instead of a boolean.
 * @returns {Promise<boolean|number>} - Returns true if the folder size is equal to or greater than the specified size. If the 'number' flag is set to true, it returns the total size as a number.
 * @throws {Error} - Throws an error if there is an issue reading the folder.
 */
export async function folderSizeIsEqualOrGreaterThan(
  folderPath,
  size,
  number = false,
) {
  let totalSize = 0

  try {
    const files = await readdir(folderPath)
    if (!number) {
      console.log(files)
    }
    for (const file of files) {
      const filePath = join(folderPath, file)
      const stats = await stat(filePath)

      if (stats.isFile()) {
        totalSize += stats.size
      } else if (stats.isDirectory()) {
        // @ts-ignore
        totalSize += await folderSizeIsEqualOrGreaterThan(filePath, size, true)
      }
      if (totalSize >= size) {
        break
      }
    }
  } catch (err) {
    throw new Error(`Error reading folder: ${err.message}`)
  }
  if (!number) {
    console.log(totalSize)
  }
  return number ? totalSize : totalSize >= size
}

/**
 * Run command in a child process.
 * @param {string} cmd
 * @param {string | undefined} cwd
 */
export async function runCommand(cmd, cwd = undefined, env = {}) {
  return new Promise((resolve, reject) => {
    const options = cwd ? { cwd } : {}
    options.env = { ...process.env, ...env };
    exec(cmd, options, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`)
        return
      }

      console.log(stderr)
      console.log(stdout)
      resolve(stdout)
    })
  })
}

/**
 * Retrieves the content of the package.json file.
 *
 * @param {string} [root=ROOT] - The root directory path.
 * @param {string} [filePath] - The path to the package.json file.
 * @returns {Promise<Object>} - A promise that resolves to the content of the package.json file.
 */
export async function getPackageJSON(
  root = ROOT,
  filePath = resolve(root, 'package.json'),
) {
  const content = JSON.parse(await readFile(filePath, 'utf-8'))
  return content
}
