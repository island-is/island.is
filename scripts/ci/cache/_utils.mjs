// @ts-check
import { arch, platform } from 'node:os'
import crypto from 'node:crypto'
import { ROOT, getPackageJSON } from './_common.mjs'
import { exec } from 'node:child_process'
import { resolve, join } from 'node:path'
import { readFile, readdir, stat } from 'node:fs/promises'

const GENERATE_HASH_GENERATED_FILES_SCRIPT = resolve(
    ROOT,
    ...'scripts/_hash-generated-files.sh'.split('/'),
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
export async function getYarnLockHash(
    root = ROOT,
    filePath = resolve(root, 'yarn.lock'),
) {
    const content = await readFile(filePath, 'utf-8')
    return crypto.createHash('sha256').update(content).digest('hex')
}

export async function fileSizeIsEqualOrGreaterThan(filePath, size) {
    try {
        const stats = await stat(filePath)
        return stats.size >= size
    } catch (err) {
        throw new Error(`Error getting file size: ${err.message}`)
    }
}

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
 * @param {string} cmd
 * @param {string | undefined} cwd
 */
export async function runCommand(cmd, cwd = undefined) {
    return new Promise((resolve, reject) => {
        const options = cwd ? { cwd } : {}
        exec(cmd, options, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`)
                return
            }

            console.log(stderr);
            console.log(stdout);
            resolve(stdout)
        })
    })
}
