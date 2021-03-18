import yargs from 'yargs'
import { GraphQLDefinitionsFactory } from '@nestjs/graphql'

import { createApp } from '@island.is/infra-nest-server'

const argv = yargs(process.argv.slice(2))
const args = argv.string('_').help().argv

const main = () => {
  const { AppModule } = require('../' + args._[0])

  createApp({ appModule: AppModule, name: 'graphql-generator' }).then((app) => {
    app.init()
  })
}

main()
