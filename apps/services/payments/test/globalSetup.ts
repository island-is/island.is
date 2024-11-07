import { register } from 'tsconfig-paths'

import { startPostgres } from '@island.is/testing/containers'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsConfig = require(`../${require('../tsconfig.json').extends}`)
register({ baseUrl: './', paths: tsConfig.compilerOptions.paths })

export default async () => {
  await startPostgres()
}
