import yargs from 'yargs'

import { createApp } from '@island.is/infra-nest-server'

const argv = yargs(process.argv.slice(2))

const main = async () => {
  const args = await argv.string('_').help().argv

  const { AppModule } = require('../' + args._[0])

  const app = await createApp({
    appModule: AppModule,
    name: 'graphql-generator',
  })
  await app.init()
  await app.close()
}

main()
