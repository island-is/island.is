/**
 * Generate HASH keys. Please edit config.mjs to change keys.
 */
// @ts-check
import { caches } from './__config.mjs'
import { ENV_HASHES_KEY } from './_const.mjs'
import { HAS_HASH_KEYS } from './_common.mjs'
import { writeToOutput, writeToSummary } from './_get_hashes_utils.mjs'



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
if (!HAS_HASH_KEYS) {
  // Only write summary if this is initial run
  await writeToSummary(HASHES)
}
writeToOutput(HASHES)
