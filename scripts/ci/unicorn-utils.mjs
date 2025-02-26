import { execSync } from 'child_process'
import { workspaceRoot } from '@nx/devkit'

const arg = JSON.parse(process.argv.slice(2))
try {
  const affected = JSON.parse(
    execSync(
      `cd ${workspaceRoot} && yarn nx show projects --affected --projects=tag:unicorn --base ${arg.baseBranch} --json | jq -r`,
    ).toString(),
  )
  console.log(affected.some((item) => unicornApps.includes(item)))
} catch (e) {
  console.error(e.message)
  process.exit(1)
}
