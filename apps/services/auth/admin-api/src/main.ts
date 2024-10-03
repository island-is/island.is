import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { environment as env } from './environments'
import { openApi } from './openApi'
import bodyParser from 'body-parser'

bootstrap({
  appModule: AppModule,
  name: 'auth-admin-api',
  openApi,
  port: env.port,
  enableVersioning: true,
  globalPrefix: 'backend',
  healthCheck: {
    database: true,
  },
  beforeServerStart: async (app) => {
    app.use(
      bodyParser.json({
        verify: (req: any, res, buf) => {
          if (buf && buf.length) {
            req.rawBody = buf
          }
        },
      }),
    )
  },
})
