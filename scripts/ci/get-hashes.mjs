/** This should not use any npm packages */

import { readFile, appendFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { arch, platform } from 'node:os'
import { exec } from 'node:child_process'
import crypto from 'node:crypto'
import { ROOT, getPackageJSON } from './_common.mjs'

const SUMMARY_TITLE = `Cache keys`
const MOBILE_APP_DIR = resolve(ROOT, ...'apps/native/app'.split('/'))
const GENERATE_HASH_GENERATED_FILES_SCRIPT = resolve(
    ROOT,
    ...'scripts/_hash-generated-files.sh'.split('/'),
)
const ENV_HASHES_KEY = 'CACHE_HASHES'
const HAS_HASH_KEYS = !!(
    process.env[ENV_HASHES_KEY] && process.env[ENV_HASHES_KEY] != 'false'
)

const HASHES = HAS_HASH_KEYS
    ? JSON.parse(process.env[ENV_HASHES_KEY])
    : {
        node_modules: `node-modules-${getPlatformString()}-${await getYarnLockHash()}-${await getPackageHash()}-${await getNodeVersionString()}`,
        'App node_modules': `app-node-modules-${getPlatformString()}-${await getYarnLockHash()}-${await getPackageHash(
            MOBILE_APP_DIR,
        )}-${await getNodeVersionString()}`,
        'Cypress Cache': `cypress-cache-${getPlatformString()}-${await getYarnLockHash()}-${await getPackageHash()}-${await getNodeVersionString()}`,
        'Generated files': `generated-files-${getPlatformString()}-${await getGeneratedFileHash()}`,
    }

const HASHES_KEYS = {
    node_modules: 'node-modules-key',
    'App node_modules': 'mobile-node-modules-key',
    'Cypress Cache': 'cypress-cache-modules-key',
    'Generated files': 'generated-files-key',
}

if (!HAS_HASH_KEYS) {
    infoScreen()
    await writeToSummary()
}
writeToOutput()

function infoScreen(hashes = HASHES) {
    
}

async function writeToSummary(
    enabled = !!process.env.GITHUB_STEP_SUMMARY,
    hashes = HASHES,
    file = process.env.GITHUB_STEP_SUMMARY ?? '',
) {
    if (!enabled) {
        return
    }
    const rows = [
        '|  Key | Hash |',
        '| --- | --- |',
        ...Object.entries(hashes).map(
            ([key, value]) => `| **${key}** | ${value} |`,
        ),
    ].join('\n')
    const title = `### ${SUMMARY_TITLE}`
    const summary = ['', title, '', rows, ''].join('\n')
    await appendFile(file, summary, 'utf-8')
}

async function writeToOutput(
    enabled = !!process.env.GITHUB_OUTPUT,
    hashes = HASHES,
    keys = HASHES_KEYS,
    file = process.env.GITHUB_OUTPUT ?? '',
) {
    if (!enabled) {
        return
    }
    const values = Object.keys(hashes)
        .map((key) => {
            return `${keys[key]}=${hashes[key]}`
        })
        .join('\n')
    await appendFile(file, values, 'utf-8')
    await appendFile(file, `\n_INIT_CACHE=${HAS_HASH_KEYS ? false : true}`, 'utf-8')
    await appendFile(file, `\nkeys=${JSON.stringify(hashes)}\n`, 'utf-8')
}

async function getGeneratedFileHash(
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

async function getYarnLockHash(
    root = ROOT,
    filePath = resolve(root, 'yarn.lock'),
) {
    const content = await readFile(filePath, 'utf-8')
    return crypto.createHash('sha256').update(content).digest('hex')
}
