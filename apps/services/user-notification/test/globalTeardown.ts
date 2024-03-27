import { StartedTestContainer } from 'testcontainers'
import { register } from 'tsconfig-paths'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsConfig = require(`../${require('../tsconfig.json').extends}`)
register({ baseUrl: './', paths: tsConfig.compilerOptions.paths })
import { stopPostgres } from '@island.is/testing/containers'

export default async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await ((global as any).__localstack__ as StartedTestContainer).stop()

  await stopPostgres()
}
