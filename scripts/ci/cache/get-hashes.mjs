/**
 * Generate HASH keys. Please edit config.mjs to change keys.
 */
// @ts-check
import { appendFile, readFile } from 'node:fs/promises'
import { caches } from './config.mjs'
import { ENV_HASHES_KEY, ENV_INIT_CACHE, ENV_KEYS } from './_const.mjs'

const SUMMARY_TITLE = `Cache keys`

const HAS_HASH_KEYS = !!(
  process.env[ENV_HASHES_KEY] && process.env[ENV_HASHES_KEY] != 'false'
)

const HASHES = HAS_HASH_KEYS
  ? JSON.parse(process.env[ENV_HASHES_KEY] || '')
  : {}
for (const value of caches) {
  if (value.enabled && !HAS_HASH_KEYS) {
    HASHES[value.id] = await value.hash()
  }
  if (!value.enabled && HAS_HASH_KEYS && HASHES[value.id]) {
    // Delete key if not enabled
    delete HASHES[value.id]
  }
}
console.log({ HAS_HASH_KEYS })
if (!HAS_HASH_KEYS) {
  // Only write summary if this is initial run
  await writeToSummary()
}
writeToOutput()

async function writeToSummary(
  enabled = !!process.env.GITHUB_STEP_SUMMARY,
  hashes = HASHES,
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

async function writeToOutput(
  enabled = !!process.env.GITHUB_OUTPUT,
  hashes = HASHES,
  file = process.env.GITHUB_OUTPUT ?? '',
) {
  if (!enabled) {
    return
  }
  const values = Object.keys(hashes)
    .map((key) => {
      return `${key}=${hashes[key]}`
    })
    .join('\n')
  await appendFile(file, values, 'utf-8')
  await appendFile(
    file,
    `\n${ENV_INIT_CACHE}=${HAS_HASH_KEYS ? 'false' : 'true'}`,
    'utf-8',
  )
  await appendFile(file, `\n${ENV_KEYS}=${JSON.stringify(hashes)}\n`, 'utf-8')
}
