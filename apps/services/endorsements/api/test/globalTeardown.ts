import { register } from 'tsconfig-paths'
import { execSync } from 'child_process'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsConfig = require(`../${require('../tsconfig.json').extends}`)
register({ baseUrl: './', paths: tsConfig.compilerOptions.paths })
import { stopPostgres } from '@island.is/testing/containers'

export default async () => {
  execSync(
    'yarn nx run services-endorsements-api:seed/undo --env test --seed 20210505212921-e2e-tests.js',
    {
      encoding: 'utf-8',
    },
  )
  await stopPostgres()
}
