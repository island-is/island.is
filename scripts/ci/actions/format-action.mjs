/**
 * Formats the codebase and commits the changes if necessary.
 */
// @ts-check
import { setFailed, info } from '@actions/core'
import { commitUnstagedChanges, getUnstagedChanges } from './_git_utils.mjs'
import { isPR } from './_pr_utils.mjs'
import { runCommand } from './_utils.mjs'
import { ROOT } from './_common.mjs'

const HEAD = process.env.HEAD
const BASE = process.env.BASE

;[{ HEAD }, { BASE }].forEach((obj) => {
  const [key, value] = Object.entries(obj)[0]
  if (!value) {
    setFailed(`Missing ${key} environment variable.`)
    process.exit(1)
  }
})

const canWrite = isPR
const action = canWrite ? 'write' : 'check'

info(`Running format:${action} for all projects.`)
let files = []
try {
  if (isPR) {
    files = (
      await runCommand(
        `yarn nx format:${action} --base=${BASE} --head=${HEAD}`,
        ROOT,
      )
    ).split('\n')
  } else {
    files = (await runCommand(`yarn nx format:${action}`, ROOT)).split('\n')
  }
} catch (error) {
  // Ignore errors.
  if (!canWrite) {
    setFailed('Error running format check.')
    process.exit(1)
  }
}

if (canWrite && files.length > 0) {
  info(`The following files were formatted:\n${files.join('\n')}`)
  const unstagedChanges = await getUnstagedChanges()
  if (unstagedChanges) {
    info(
      `Unstaged changes found:\n${unstagedChanges.join(
        '\n',
      )} Committing changes.`,
    )
    await commitUnstagedChanges({
      user: 'dirtybot',
      message: 'chore: format files',
    })
    setFailed('Unstaged changes for formatting were committed.')
    process.exit(1)
  }
  info('No unstaged changes found.')
  process.exit(0)
}
info('File formatting check complete.')
process.exit(0)
