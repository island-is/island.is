import { execSync } from 'child_process'
import { workspaceRoot } from '@nx/devkit'

const arg = JSON.parse(process.argv.slice[2] ?? '{}')
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
