import { Module } from '@nestjs/common'
import fetch from 'isomorphic-fetch'
import { Configuration, MetaservicesApi } from '../../gen/fetch-xrd'
import {
  Configuration as RestConfiguration,
  RestMetaservicesApi,
} from '../../gen/fetch-xrd-rest'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { XroadClientController } from './xroadclient.controller'
import { XroadClientService } from './xroadclient.service'

const XROAD_BASE_PATH = 'http://testcomss01.playground.x-road.global'
const XROAD_CLIENT = {
  xroadInstance: 'PLAYGROUND',
  memberClass: 'COM',
  memberCode: '1234567-8',
  subsystemCode: 'TestClient',
}

@Module({
  imports: [],
  controllers: [AppController, XroadClientController],
  providers: [
    AppService,
    XroadClientService,
    {
      provide: MetaservicesApi,
      useFactory: () =>
        new MetaservicesApi(
          new Configuration({
            fetchApi: fetch,
            basePath: XROAD_BASE_PATH,
            headers: {
              Accept: 'application/json',
            },
          }),
        ),
    },
    {
      provide: RestMetaservicesApi,
      useFactory: () =>
        new RestMetaservicesApi(
          new RestConfiguration({
            fetchApi: fetch,
            basePath: XROAD_BASE_PATH + '/r1',
            headers: {
              Accept: 'application/json',
              'X-Road-Client': `${XROAD_CLIENT.xroadInstance}/${XROAD_CLIENT.memberClass}/${XROAD_CLIENT.memberCode}/${XROAD_CLIENT.subsystemCode}`,
            },
          }),
        ),
    },
  ],
})
export class AppModule {}
