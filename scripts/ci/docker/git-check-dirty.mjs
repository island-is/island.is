// @ts-check
import { execSync, spawnSync } from 'node:child_process'
// @ts-ignore - current tsconfig does not support ESM modules etc. This is just for typing.
import path from 'node:path'
import { getGithubToken } from './get-github-token-helper.mjs'

// This creates circular problems!
const IGNORED_FILES = ['tsconfig.base.json', '.yarnrc.yml']
const PRIVATE_KEY = 'DIRTYBOT_KEY'
const APP_ID = 'DIRTYBOT_APP_ID'

const { relPath, action, owner, privateKey, appId, repoRoot, absPath, isCi } =
  getProps()

!isCi && console.info(`Running in non-CI mode, does not push for real.`)
shouldRunGuard()
console.info(`Repository root: ${repoRoot} path to check: ${absPath}`)
console.info(
  `Checking if ${relPath} is dirty with action: ${action} and pushing with owner: ${owner}`,
)

const dirtyFiles = getDirtyFiles()

if (dirtyFiles.length === 0) {
  console.info('No dirty files found, exiting.')
  process.exit(0)
}

console.info(`Dirty files found: ${dirtyFiles.join(', ')}`)

// @ts-ignore - current tsconfig does not support ESM modules etc. This is just for typing.
await setCommitIdentity()
pushFiles()

function pushFiles() {
  if (!isCi) {
    return
  }
  for (const dirtyFile of dirtyFiles) {
    // This is if we want to ignore some files.
    run('git', ['add', dirtyFile], { cwd: repoRoot })
  }
  run('git', ['commit', '-m', `chore: ${action} update dirty file`], {
    cwd: repoRoot,
  })
  const output = runCapture('git', ['push', '--dry-run'], { cwd: repoRoot })
  console.log(output)
  run('git', ['push'], { cwd: repoRoot })
}

function getUrlWithToken(token) {
  return `https://x-access-token:${token}@${getCurrentUrl()}`
}

function getCurrentUrl() {
  const origin = runCapture('git', ['remote', 'get-url', 'origin']).trim()
  console.log(`Current origin url: ${origin}`)
  const url = (() => {
    if (origin.startsWith('https://') && !origin.includes('@')) {
      return origin.split('https://')[1]
    }
    return origin.split('@')[1].replace(':', '/')
  })()
  return url
}

/**
 * Gets a list of dirty files in the repository.
 * @returns {string[]} An array of dirty files relative to the repository root.
 */
function getDirtyFiles() {
  const ignoredFiles = getIgnoredFiles()
  const stat = runCapture(
    'git',
    ['diff', '--name-only', '--', `"${absPath}"`],
    { cwd: repoRoot },
  )
    .split('\n')
    .filter(Boolean)
    .map((e) => path.resolve(repoRoot, e))
    .filter((e) => !ignoredFiles.includes(e))
  return stat
}

function commitAsGithubActions() {
  console.info(`Setting user as Github Actions`)
  if (!isCi) {
    return
  }
  run('git', ['config', 'user.name', 'github-actions[bot]'], { cwd: repoRoot })
  run(
    'git',
    ['config', 'user.email', 'github-actions[bot]@users.noreply.github.com'],
    { cwd: repoRoot },
  )
}

async function commitAsDirtyBot() {
  console.info(`Setting user as Dirty Bot`)
  if (!appId || !privateKey) {
    console.error(
      `Error: ${APP_ID} or ${PRIVATE_KEY} environment variable is not`,
    )
  }
  const gitToken = await getGithubToken(appId, privateKey)
  const url = getUrlWithToken(gitToken)

  if (!isCi) {
    return
  }
  run('git', ['remote', 'set-url', 'origin', url], { cwd: repoRoot })

  run('git', ['config', 'user.name', 'islandisis-bot'], { cwd: repoRoot })
  run('git', ['config', 'user.email', 'ci@island.is'], { cwd: repoRoot })
}

async function setCommitIdentity() {
  switch (owner) {
    case 'github actions':
      commitAsGithubActions()
      break
    case 'dirtybot':
      await commitAsDirtyBot()
      break
    default:
      console.error('Error: Unknown owner!')
      process.exit(1)
  }
}

function getIgnoredFiles() {
  return IGNORED_FILES.map((file) => path.resolve(repoRoot, file))
}

/**
 * Prints usage information and exits the process.
 * @returns {never} This function never returns as it calls process.exit()
 */
function usage() {
  console.error(
    'Usage: node git-check-dirty.mjs <relative_path> <action> [owner]',
  )
  process.exit(1)
}

/**
 * Executes a command synchronously and exits the process if the command fails.
 *
 * @param {string} cmd - The command to execute
 * @param {string[]} argv - Array of arguments to pass to the command
 * @param {object} [opts={}] - Additional options to pass to spawnSync
 * @throws {void} Exits the process with the command's exit status if non-zero
 */
function run(cmd, argv, opts = {}) {
  /**
   * Standard I/O configuration for child processes.
   * When set to 'inherit', the child process will use the same stdio as the parent process.
   * @const {string}
   */
  const stdio = 'inherit'
  const res = spawnSync(cmd, argv, { stdio, ...opts })
  if (res.status !== 0) {
    process.exit(res.status ?? 1)
  }
}

/**
 * Executes a command synchronously and returns the trimmed output as a string.
 *
 * @param {string} cmd - The command to execute
 * @param {string[]} argv - Array of command arguments
 * @param {object} [opts={}] - Additional options to pass to execSync
 * @returns {string} The trimmed stdout output from the executed command
 * @throws {Error} Throws an error if the command execution fails
 */
function runCapture(cmd, argv, opts = {}) {
  return execSync([cmd, ...argv].join(' '), {
    encoding: 'utf8',
    ...opts,
  }).trim()
}

/**
 * Parses and validates command line arguments for the git dirty check script.
 *
 * @returns {{relPath: string, action: string, owner: 'github actions' | 'dirtybot', privateKey: string | null, appId: string | null,  repoRoot: string, absPath: string, isCi: boolean}} An object containing:
 *   - relPath: The relative file path to check
 *   - action: The action type ("github_actions" or "dirtybot")
 *   - owner: The validated owner ("github actions" or "dirtybot")
 * @throws {Error} Exits the process if owner is not "github actions" or "dirtybot"
 */
function getProps() {
  const args = process.argv.slice(2)
  const isCi = !!process.env.CI
  if (args.length < 2) {
    usage()
  }
  /**
   * Destructures command line arguments into path, action type, and owner information.
   * @param {string} relPath - The relative file path to check
   * @param {string} action - The action type, either "github_actions" or "dirtybot"
   * @param {'github actions' | 'dirtybot' | undefined} ownerRaw - Raw owner information (needs further processing)
   */
  const [relPath, action, ownerRaw] = args
  const owner = (ownerRaw ?? 'github actions').toLowerCase()
  if (owner !== 'github actions' && owner !== 'dirtybot') {
    console.error('Error: owner must be either "github actions" or "dirtybot"')
    usage()
  }
  const { privateKey, appId } = getPrivateKey(owner)
  const { repoRoot, absPath } = getPaths(relPath)
  return { relPath, action, owner, privateKey, appId, repoRoot, absPath, isCi }
}

/**
 * Gets the repository root path and absolute path for a relative path.
 * @param {string} relPath - The relative path to resolve from the repository root
 * @returns {{repoRoot: string, absPath: string}} An object containing the repository root directory and the absolute path resolved from the repository root and relative path
 */
function getPaths(relPath) {
  const repoRoot = runCapture('git', ['rev-parse', '--show-toplevel'])
  const absPath = path.resolve(repoRoot, relPath)
  return { repoRoot, absPath }
}

/**
 * Gets the token for the specified owner.
 * @param {'dirtybot' | 'github actions'} owner
 * @returns {{privateKey: string | null, appId: string | null}} The token for the owner, or null if not applicable
 */
function getPrivateKey(owner) {
  if (owner === 'dirtybot') {
    // Dirtybot requires a token
    if (!process.env[PRIVATE_KEY]) {
      console.error(`Error: ${PRIVATE_KEY} environment variable is not set.`)
      process.exit(1)
    }
    if (!process.env[APP_ID]) {
      console.error(`Error: ${APP_ID} environment variable is not set.`)
      process.exit(1)
    }
    return { privateKey: process.env[PRIVATE_KEY], appId: process.env[APP_ID] }
  }
  return { privateKey: null, appId: null }
}

function shouldRunGuard() {
  const commitMsg = runCapture('git', ['log', '-1', '--pretty=%B'], {
    cwd: repoRoot,
  })
    .trim()
    .split('\n')
    .find(Boolean)
  if (!commitMsg) {
    throw new Error('Could not get commit message')
  }
  if (commitMsg.includes(`chore: ${action} update dirty file`)) {
    console.info(
      `Last commit was a ${action} dirty file update, not running again.`,
    )
    process.exit(0)
  }
}
