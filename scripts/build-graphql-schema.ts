import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { createApp } from '@island.is/infra-nest-server'

const main = async () => {
  const args = await yargs(hideBin(process.argv)).string('_').argv

  const { AppModule } = require('../' + args._[0])

  console.log('Before createApp')
  console.time('createApp')
  const app = await createApp({
    appModule: AppModule,
    name: 'graphql-generator',
  })
  console.timeEnd('createApp')
  console.log('After createApp')

  console.log('Before app.init')
  console.time('app.init')
  await app.init()
  console.timeEnd('app.init')
  console.log('After app.init')

  console.log('Before app.close')
  console.time('app.close')
  await app.close()
  console.timeEnd('app.close')
  console.log('After app.close')
}

main()
