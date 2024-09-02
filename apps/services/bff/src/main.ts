import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { environment } from './environment'

bootstrap({
  appModule: AppModule,
  name: 'bff',
  port: environment.port,
  globalPrefix: environment.globalPrefix,
  ...(!environment.production && {
    enableCors: environment.enableCors,
  }),
  healthCheck: {
    timeout: 1000,
  },
})
