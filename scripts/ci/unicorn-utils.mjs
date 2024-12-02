import { execSync } from 'child_process'
import { workspaceRoot } from '@nx/devkit'

const unicornApps = ['unicorn-app']

try {
  const affected = JSON.parse(
    execSync(`cd ${workspaceRoot} && yarn nx show projects --affected --base origin/main --json | jq -r`)
      .toString())
  console.log(affected.some((item) => unicornApps.includes(item)))
} catch (e) {
  console.error(e.message)
  process.exit(1)
}
