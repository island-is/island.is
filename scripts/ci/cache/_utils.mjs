// @ts-check
import { arch, platform } from 'node:os'
import crypto from 'node:crypto'
import { ROOT } from './_common.mjs'
import { spawn } from 'node:child_process'
import { resolve, join } from 'node:path'
import { readFile, readdir, stat } from 'node:fs/promises'

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
  return getFileHash(filePath)
}

export async function getFileHash(file) {
  const content = await readFile(file, 'utf-8')
  return crypto.createHash('sha256').update(content).digest('hex')
}

export async function getFilesHash(files = []) {
  const contents = await Promise.all(
    files.sort().map((file) => readFile(file, 'utf-8')),
  )
  const combinedContent = contents.join('')
  return crypto.createHash('sha256').update(combinedContent).digest('hex')
}

export function sleep(ms = 50) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function tryRun(fn, name, args = []) {
  try {
    await fn(...args)
    return true
  } catch (error) {
    console.log({ type: 'RUN FAILED', name, error })
    return false
  }
}

/**
 * Checks if the file size is e1qual to or greater than the specified size.
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

  return number ? totalSize : totalSize >= size
}

/**
 * Run command in a child process.
 * @param {string} cmd
 * @param {string | undefined} cwd
 */
export async function runCommand(cmd, cwd = undefined, env = {}) {
  return new Promise((resolve, reject) => {
    const options = cwd ? { cwd, encoding: 'utf-8' } : {}
    options.env = {
      ...process.env,
      ...env,
      NODE_OPTIONS: '--max-old-space-size=4096',
    }
    options.encoding = 'utf-8'

    const [command, ...args] = Array.isArray(cmd) ? cmd : cmd.split(' ')

    const childProcess = spawn(command, args, options)
    childProcess.stdout.setEncoding('utf-8')
    const errorChunks = []
    const outputChunks = []

    childProcess.stdout.on('data', (data) => {
      // console.log(data.toString())
      outputChunks.push(data.toString())
    })

    childProcess.stderr.on('data', (data) => {
      console.error(data.toString())
      errorChunks.push(data.toString())
    })

    childProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(errorChunks.join('\n'))
        console.error(`Failed to run command: ${cmd} returning code ${code}`)
        console.log(outputChunks.join('\n'))
        reject(`Error: Process exited with code ${code}`)
        return
      }
      resolve(void 0)
    })

    childProcess.on('error', (error) => {
      console.log(errorChunks.join('\n'))
      // reject(`Error: ${error.message}`)
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

export function arrayIncludesOneOf(array, values) {
  return values.some((value) => array.includes(value))
}

export function retry(fn, retries = 5, delay = 2000) {
  return new Promise((resolve, reject) => {
    const attempt = async (n) => {
      console.log(`Retrying ${fn.name} - ${n} attempts left`)
      try {
        const value = await fn()
        resolve(value)
      } catch (error) {
        if (n <= 0) {
          reject(error)
          return
        }
        setTimeout(() => attempt(n - 1), delay)
      }
    }
    attempt(retries)
  })
}
