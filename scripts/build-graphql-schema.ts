import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { createApp } from '@island.is/infra-nest-server'

const main = async () => {
  const args = await yargs(hideBin(process.argv)).string('_').argv

  const { AppModule } = require('../' + args._[0])

  const app = await createApp({
    appModule: AppModule,
    name: 'graphql-generator',
  })
  await app.init()
  await app.close()
}

main()
