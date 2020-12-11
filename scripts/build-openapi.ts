import yargs from 'yargs'
import {
  createApp,
  setupOpenApi,
  generateSchema,
} from '@island.is/infra-nest-server'

const argv = yargs(process.argv.slice(2))
const args = argv.string('rootModule').help().argv

const main = async () => {
  const { config } = require(args._[0])

  createApp({ appModule: config.appModule, name: 'openapi-generator' }).then(
    (app) => {
      const document = setupOpenApi(app, config.openApi.document)
      generateSchema(config.openApi.path, document)
    },
  )
}

main()
