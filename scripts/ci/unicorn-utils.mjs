// @ts-check
import { execSync } from 'child_process'
import { workspaceRoot } from '@nx/devkit'

// NOTE: Using `console.error` in this script to log, without affecting the "output" to standard output

const NX_UNICORN_TAG = 'ci:unicorn'
/**
 * Executes multiple nx commands with given named command arrays
 * @param {Object.<string, string[]>} commandsMap - Map of command names to command argument arrays
 * @param {string} workspaceRoot - The workspace root directory
 * @returns {Object.<string, any>} Object with parsed JSON results for each command name
 * @throws {Error} If any command execution fails
 */
function runNxCommands(commandsMap, workspaceRoot) {
  const results = {}

  for (const [cmdName, cmdArgs] of Object.entries(commandsMap)) {
    console.error(`Running ${cmdName} command in ${workspaceRoot}:`, {
      cmdArgs,
    })

    try {
      const cmdString = cmdArgs.join(' ')
      const result = execSync(`cd ${workspaceRoot} && ${cmdString}`).toString()
      const parsedResult = JSON.parse(result)
      console.error(`${cmdName} result:`, parsedResult)
      results[cmdName] = parsedResult
    } catch (e) {
      console.error(`Error executing ${cmdName}:`, e.message)
      throw e
    }
  }

  return results
}

/**
 * Gets the base branch from environment variables or arguments
 * @param {string[]} args - Command line arguments
 * @returns {string} The base branch name
 */
function getBaseBranch(args) {
  const arg = JSON.parse(args[0] ?? '{}')
  return process.env.GIT_BASE || process.env.NX_BASE || arg.base
}

/**
 * Creates command arrays for different project queries
 * @param {string} baseBranch - The Git base branch
 * @returns {Object.<string, string[]>} Map of command names to command arrays
 */
function createCommandsMap(baseBranch) {
  const allApps = ['yarn', 'nx', 'show', 'projects', '--json']
  const affected = [`--base=${baseBranch}`, '--affected']

  const affectedApps = [...allApps, ...affected]
  const allUnicorns = [...allApps, `--projects=tag:${NX_UNICORN_TAG}`]
  const affectedUnicorns = [...allUnicorns, ...affected]

  return {
    affectedApps,
    allUnicorns,
    affectedUnicorns,
  }
}

/**
 * Gets the results of all commands for unicorn projects
 * @param {string[]} args - Command line arguments
 * @returns {Object.<string, any>} The results of all commands
 */
function getResults(args) {
  try {
    const baseBranch = getBaseBranch(args)
    const commandsMap = createCommandsMap(baseBranch)
    return runNxCommands(commandsMap, workspaceRoot)
  } catch (e) {
    console.error(e.message)
    process.exit(1)
  }
}

/**
 * Determines if there are any affected projects with the "unicorn" tag
 * @param {string[]} args - Command line arguments
 * @returns {boolean} Whether there are affected unicorn projects
 */
function isUnicorn(args) {
  const results = getResults(args)
  const hasAffectedUnicorns = results.affectedUnicorns.length > 0
  console.log(hasAffectedUnicorns)
  return hasAffectedUnicorns
}

/**
 * Displays a list of unicorn applications
 * If `--json`, output as a JSON string, otherwise, output as a comma-separated string
 * @param {string[]} args - Command line arguments
 * @returns {string[]} The list of unicorn applications
 */
function showUnicorns(args) {
  const results = getResults(args)
  const unicornApps = results.allUnicorns

  const joined = args.includes('--json')
    ? JSON.stringify(unicornApps)
    : unicornApps.join(',')

  console.error(`Unicorn apps:`, unicornApps)
  console.log(joined)
  return unicornApps
}

function main() {
  const cmd = process.argv[2]
  const args = process.argv.slice(3)

  switch (cmd) {
    case 'is-unicorn':
      isUnicorn(args)
      break
    case 'show-unicorns':
      showUnicorns(args)
      break
    default:
      console.error(`Unknown unicorn utils command: ${cmd}`)
      process.exit(1)
  }
}

main()
