// @ts-check
import { execSync } from 'child_process'
import { workspaceRoot } from '@nx/devkit'

const baseBranch = process.env.GIT_BASE || process.env.NX_BASE || 'HEAD^1'
const app = process.argv[2]

const nxCmd = [
  'yarn',
  'nx',
  'show',
  'projects',
  '--affected',
  `--base=${baseBranch}`,
  '--head=HEAD',
  '--json',
]
console.error(`Running command in ${workspaceRoot}:`, { nxCmd })
try {
  const affected = JSON.parse(
    execSync(`cd ${workspaceRoot} && ${nxCmd.join(' ')}`).toString(),
  )
  console.error(`Affected projects:`, affected)

  const isAppAffected = affected.some(
    /** @param {string} project */ (project) => project.includes(app),
  )
  console.error(`Contains '${app}': ${isAppAffected}`)
  console.log(isAppAffected ? 'true' : 'false')
} catch (e) {
  console.error(e.message)
  process.exit(1)
}
