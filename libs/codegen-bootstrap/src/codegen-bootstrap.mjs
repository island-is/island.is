// @ts-check
import { writeFile } from 'node:fs/promises'
import { SCHEMA_CONTENT, SCHEMA_PATH } from './const.mjs'

/**
 * We need to create this file manually with a dummy content because
 * the api needs it to build and generate the first schema file.
 *
 * This is cached by NX and only should run when root changes.
 */

await writeFile(SCHEMA_PATH, SCHEMA_CONTENT, 'utf-8')
