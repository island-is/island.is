import { Module } from '@nestjs/common'
import fetch from 'isomorphic-fetch'
import { Configuration, MetaservicesApi } from '../../gen/fetch-xrd'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ClientsController } from './xroadclients.controller'

@Module({
  imports: [],
  controllers: [AppController, ClientsController],
  providers: [
    AppService,
    {
      provide: MetaservicesApi,
      useFactory: () =>
        new MetaservicesApi(
          new Configuration({
            fetchApi: fetch,
            basePath: 'http://testcomss01.playground.x-road.global',
            headers: {
              Accept: 'application/json',
            },
          }),
        ),
    },
  ],
})
export class AppModule {}
