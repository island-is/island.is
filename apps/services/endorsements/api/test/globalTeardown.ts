import { register } from 'tsconfig-paths'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsConfig = require(`../${require('../tsconfig.json').extends}`)
register({ baseUrl: './', paths: tsConfig.compilerOptions.paths })
import { stopPostgres } from '@island.is/testing/containers'
import { execSync } from 'child_process'

export default async () => {
  execSync(
    'cross-env NODE_ENV=test yarn nx run services-endorsements-api:seed/undo --seed 20210505212921-e2e-tests.js',
  )
  await stopPostgres()
}
