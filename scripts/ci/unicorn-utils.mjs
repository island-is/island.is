// @ts-check
import { execSync } from 'child_process'
import { workspaceRoot } from '@nx/devkit'

const unicornApps = ['payments', 'services-payments']

// NOTE: Using `console.error` in this script to log, without affecting the "output" to standard output

/**
 * Determines if there are any affected projects with the "unicorn" tag based on the current Git base branch.
 *
 * @param {string[]} args - The input arguments, expected to be a JSON string array where the first element contains the base branch information.
 */
const isUnicorn = (args) => {
  const arg = JSON.parse(args[0] ?? '{}')
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
    console.log(affected.length > 0)
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
