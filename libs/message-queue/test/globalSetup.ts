import { register } from 'tsconfig-paths'

const tsConfig = require(`../${require('../tsconfig.json').extends}`)
register({ baseUrl: './', paths: tsConfig.compilerOptions.paths })
import { startLocalstack } from '@island.is/testing/containers'

export default async () => {
  await startLocalstack()
}
