import { register } from 'tsconfig-paths'

 
const tsConfig = require(`../${require('../tsconfig.json').extends}`)
register({ baseUrl: './', paths: tsConfig.compilerOptions.paths })

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default async () => {}
