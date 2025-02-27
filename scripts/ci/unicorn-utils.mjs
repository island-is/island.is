import { execSync } from 'child_process'
import { workspaceRoot } from '@nx/devkit'
import { logger } from './_common.mjs'

const argSlice = process.argv[2]
logger.info('Running utils with args:', {
  procargv: process.argv,
  argSlice,
})
const arg = JSON.parse(argSlice)
logger.info('Running utils with args:', { arg })
const baseBranch = process.env.GIT_BASE || process.env.NX_BASE || arg.base
const nxCmd = [
  'yarn',
  'nx',
  'show',
  'projects',
  '--affected',
  '--projects=tag:unicorn',
  `--base=${baseBranch}`,
  '--json',
]
logger.info(`Running command:`, { nxCmd })
try {
  const affected = JSON.parse(
    execSync(`cd ${workspaceRoot} && ${nxCmd.join(' ')}`).toString(),
  )
  logger.info('Affected output:', { affected })
  console.log(affected.length > 0)
} catch (e) {
  logger.error(e.message)
  process.exit(1)
}
