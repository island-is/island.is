import { execSync } from 'child_process'
import { workspaceRoot } from '@nx/devkit'

const unicornApps = ['unicorn-app']

const arg = JSON.parse(process.argv.slice(2))
console.log(`Comparing nx affected for ${arg.sourceBranch} using ${arg.targetBranch} as base branch`);

try {
  const affected = JSON.parse(
    execSync(
      `cd ${workspaceRoot} && yarn nx show projects --affected --base ${arg.targetBranch} --json | jq -r`,
    ).toString(),
  )
  console.log(affected.some((item) => unicornApps.includes(item)))
} catch (e) {
  console.error(e.message)
  process.exit(1)
}
