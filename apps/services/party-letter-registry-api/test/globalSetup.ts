import { execSync } from 'child_process'
import { register } from 'tsconfig-paths'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsConfig = require(`../${require('../tsconfig.json').extends}`)
register({ baseUrl: './', paths: tsConfig.compilerOptions.paths })
import { startPostgres } from '@island.is/testing/containers'

export default async () => {
  await startPostgres()

  execSync('yarn nx run services-party-letter-registry-api:migrate --env test')
  execSync(
    'yarn nx run services-party-letter-registry-api:seed --env test --seed 20210514153818-e2e-tests.js',
  )
}
