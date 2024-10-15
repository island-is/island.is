import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { environment } from './environment'
import { RequestMethod } from '@nestjs/common'

bootstrap({
  appModule: AppModule,
  name: 'bff',
  port: environment.port,
  globalPrefix: {
    prefix: `${environment.keyPath}/bff`,
    options: {
      exclude: [{ path: 'health/check', method: RequestMethod.GET }],
    },
  },
  healthCheck: true,
})
