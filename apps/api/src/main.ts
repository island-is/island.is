import { bootstrap } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
import { getConfig as config } from './app/environments'

bootstrap({
  appModule: AppModule,
  name: 'api',
  port: 4444,
  stripNonClassValidatorInputs: false,
  jsonBodyLimit: '300kb',
  ...(!config.production && {
    enableCors: config.enableCors,
  }),
})
