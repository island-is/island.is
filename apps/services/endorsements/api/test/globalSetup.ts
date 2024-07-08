import { register } from 'tsconfig-paths'
import { execSync } from 'child_process'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsConfig = require(`../${require('../tsconfig.json').extends}`)
register({ baseUrl: './', paths: tsConfig.compilerOptions.paths })
import { startPostgres } from '@island.is/testing/containers'

export default async () => {
  await startPostgres()
  execSync(
    'cross-env NODE_ENV=test yarn nx run services-endorsements-api:migrate',
  )
  execSync(
    'cross-env NODE_ENV=test yarn nx run services-endorsements-api:seed --seed 20210505212921-e2e-tests.js',
  )
}
