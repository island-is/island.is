// @ts-check
import { appendFile } from 'node:fs/promises'
import { ENV_INIT_CACHE, ENV_KEYS } from './_const.mjs'
import { HAS_HASH_KEYS } from './_common.mjs'
import { keys } from './__config.mjs'
const SUMMARY_TITLE = `Cache keys`

export async function writeToSummary(
    hashes,
    enabled = !!process.env.GITHUB_STEP_SUMMARY,
    file = process.env.GITHUB_STEP_SUMMARY ?? '',
) {
    if (!enabled) {
        console.log(`Step summary is not enabled`)
        return
    }
    console.log(`Step summary is enabled`)
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
    Object.keys(hashes)
        .forEach((key) => {
            keys[key] = hashes[key];
        })
    await appendFile(
        file,
        `${ENV_INIT_CACHE}=${HAS_HASH_KEYS ? 'false' : 'true'}\n`,
        'utf-8',
    )
    await appendFile(file, `${ENV_KEYS}=${JSON.stringify(hashes)}\n`, 'utf-8')
}
