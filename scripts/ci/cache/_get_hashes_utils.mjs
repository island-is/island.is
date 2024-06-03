// @ts-check
import { appendFile, readFile } from 'node:fs/promises'
import { ENV_INIT_CACHE, ENV_KEYS } from './_const.mjs'
import { HAS_HASH_KEYS } from './_common.mjs'


const SUMMARY_TITLE = `Cache keys`

export async function writeToSummary(
    hashes,
    enabled = !!process.env.GITHUB_STEP_SUMMARY,
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

export async function writeToOutput(
    hashes,
    enabled = !!process.env.GITHUB_OUTPUT,
    file = process.env.GITHUB_OUTPUT ?? '',
) {
    if (!enabled) {
        return
    }
    await appendFile(
        file,
        `${ENV_INIT_CACHE}=${HAS_HASH_KEYS ? 'false' : 'true'}\n`,
        'utf-8',
    )
    await appendFile(file, `${ENV_KEYS}=${JSON.stringify(hashes)}\n`, 'utf-8')
    const content = await readFile(file, { encoding: 'utf-8' })
    console.log(content);
}


export async function writeToOutputPost(
    success = false,
    enabled = !!process.env.GITHUB_OUTPUT,
    file = process.env.GITHUB_OUTPUT ?? '',
) {
    if (!enabled) {
        return
    }
    await appendFile(
        file,
        `success=${success ? 'true' : 'false'}\n`,
        'utf-8',
    )    
    const content = await readFile(file, { encoding: 'utf-8' })
    console.log(content);
}
