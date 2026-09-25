// @ts-check
/**
 * Prints a hash of the CI configuration if the changes between two commits touch it,
 * and nothing otherwise.
 *
 * The output is meant for the CI_CONFIG_HASH environment variable, which is an input of every
 * Nx task (see `sharedGlobals` in nx.json). The CI configuration itself is not an input, so
 * changing it does not invalidate the Nx cache of anyone. A pull request that does change it
 * sets the variable, which has two effects:
 *
 * - No task is a cache hit, so the changed CI is tested by running everything for real
 * - The results are cached under hashes of their own, so if the change breaks the environment
 *   the tasks run in, the bad results can't be a cache hit outside of that pull request
 *
 * Usage: node scripts/ci/ci-config-hash.mjs <base> <head>
 */
import { execFileSync } from 'child_process'
import { createHash } from 'crypto'
import { pathToFileURL } from 'url'

export const CI_CONFIG_PATHS = [
  '.github/workflows/',
  '.github/actions/',
  'scripts/ci/',
]
const isCiConfig = (/** @type {string} */ file) =>
  CI_CONFIG_PATHS.some((path) => file.startsWith(path)) && !file.endsWith('.md')

const git = (/** @type {string[]} */ args) =>
  execFileSync('git', args, {
    encoding: 'utf-8',
    maxBuffer: 64 * 1024 * 1024,
  })
    .split('\n')
    .filter(Boolean)

/**
 * @param {string} base
 * @param {string} head
 * @returns {string} hash of the CI configuration at `head`, empty if it is the same as at `base`
 */
export const ciConfigHash = (base, head) => {
  const changed = git(['diff', '--name-only', base, head]).filter(isCiConfig)
  if (changed.length === 0) return ''
  console.error(`CI configuration changed:\n${changed.join('\n')}`)

  // `<mode> <type> <object hash>\t<file>` of every file, the object hash is from the content
  const files = git(['ls-tree', '-r', head, '--', ...CI_CONFIG_PATHS]).filter(
    (line) => isCiConfig(line.split('\t')[1]),
  )
  return createHash('sha256')
    .update(files.join('\n'))
    .digest('hex')
    .slice(0, 16)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [base, head] = process.argv.slice(2)
  if (!base || !head) {
    console.error('Usage: node scripts/ci/ci-config-hash.mjs <base> <head>')
    process.exit(1)
  }
  console.log(ciConfigHash(base, head))
}
