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
  const isBuildingOpenApi = config?.openApi
  const name = isBuildingOpenApi ? 'openapi-generator' : 'graphql-generator'

  createApp({ appModule: config.appModule, name }).then((app: any) => {
    if (isBuildingOpenApi) {
      const document = setupOpenApi(app, config.openApi.document)
      generateSchema(config.openApi.path, document)
    } else {
      app.init()
    }
  })
}

main()
