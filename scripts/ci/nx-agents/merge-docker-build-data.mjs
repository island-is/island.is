// @ts-check
/**
 * Merges what the `docker-build` tasks wrote about the images they built (one file per image,
 * uploaded by the agents) into the file `scripts/ci/docker/write-data.mjs` writes in the
 * pipelines that build the images in a matrix.
 *
 * Usage: node scripts/ci/nx-agents/merge-docker-build-data.mjs <directory> <expected projects, comma separated>
 */
import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const [directory, expected = ''] = process.argv.slice(2)

const images = readdirSync(directory)
  .filter((file) => file.endsWith('.json'))
  .map((file) => JSON.parse(readFileSync(join(directory, file), 'utf-8')))
  .map((image) => ({ id: image.project, ...image }))

const built = new Set(images.map((image) => image.project))
const missing = expected
  .split(',')
  .filter((project) => project !== '' && !built.has(project))
if (missing.length > 0) {
  console.error(`No image was built for: ${missing.join(', ')}`)
  process.exit(1)
}

writeFileSync('/tmp/data.json', JSON.stringify(images, null, 2))
console.log(`${images.length} images:\n${[...built].sort().join('\n')}`)
