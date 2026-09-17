// Preload for running a production build of an app locally, e.g.
//   node -r ./apps/system-e2e/src/support/load-local-env.js dist/apps/<app>/main.js
//
// nx loads the workspace .env files into every task it runs, which is how a
// dev server gets its API keys. A production bundle started with plain node
// gets nothing, so load the same files here. Existing variables win, and a
// missing file is fine.
const { existsSync } = require('fs')
const { join } = require('path')
const dotenv = require('dotenv')

const root = join(__dirname, '../../../..')

for (const file of ['.env', '.env.secret']) {
  const path = join(root, file)
  if (existsSync(path)) {
    dotenv.config({ path, override: false })
  }
}
