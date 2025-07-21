// @ts-check
import { execSync } from 'child_process'
import { workspaceRoot } from '@nx/devkit'

const unicornApps = ['unicorn-app', 'payments', 'services-payments']

// NOTE: Using `console.error` in this script to log, without affecting the "output" to standard output

/**
 * Determines if there are any affected projects with the "unicorn" tag based on the current Git base branch.
 *
 * @param {string} jsonString - A JSON string of the form {"head": "<head>", "base": "<base>" }
 */
const affectedUnicorns = (jsonString) => {
  const arg = JSON.parse(jsonString ?? '{}')
  const baseBranch = process.env.GIT_BASE || process.env.NX_BASE || arg.base

  const nxCmd = [
    'yarn',
    'nx',
    'show',
    'projects',
    '--affected',
    // '--projects=tag:unicorn',
    `--projects=${unicornApps.join(',')}`,
    `--base=${baseBranch}`,
    '--json',
  ]
  console.error(`Running command in ${workspaceRoot}:`, { nxCmd })
  try {
    const affected = JSON.parse(
      execSync(`cd ${workspaceRoot} && ${nxCmd.join(' ')}`).toString(),
    )
    console.error(`Affected projects:`, affected)
  } catch (e) {
    console.error(e.message)
    process.exit(1)
  }
}

/**
 * Displays a list of unicorn applications.
 * If `--json`, output as a JSON string, otherwise, output as a comma-separated string.
 *
 * @param {string[]} args - The command line arguments.
 * @returns {string[]} The list of unicorn applications.
 */
const showUnicorns = (args) => {
  const joined = args.includes('--json')
    ? JSON.stringify(unicornApps)
    : unicornApps.join(',')
  console.error(`Unicorn apps:`, unicornApps)
  console.log(joined)
  return unicornApps
}

/**
 * Exits with exit code 0 (success) if the requested application is a unicorn app, 1 (failure) otherwise
 *
 * @param {string} app - Nx application to check for unicornity
 */
const isUnicorn = (app) => {
  const included = unicornApps.includes(app)
  process.exit(included ? 0 : 1)
}

const cmd = process.argv[2]
const args = process.argv.slice(3)
switch (cmd) {
  case 'affected':
    affectedUnicorns(args[0])
    break
  case 'is-unicorn':
    isUnicorn(args[0])
    break
  case 'show-unicorns':
    showUnicorns(args)
    break
  default:
    console.error(`Unknown unicorn utils command: ${cmd}`)
    process.exit(1)
}
