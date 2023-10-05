//import yargs from 'yargs'
const yargs = require('yargs')

import { createApp } from '@island.is/infra-nest-server'

const argv = yargs(process.argv.slice(2))
const args = argv.string('_').help().argv

const main = async () => {
  const { AppModule } = require('../' + args._[0])

  const app = await createApp({
    appModule: AppModule,
    name: 'graphql-generator',
  })
  await app.init()
  await app.close()
}

main()
