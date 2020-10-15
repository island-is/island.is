import { Module } from '@nestjs/common'
import fetch from 'isomorphic-fetch'
import { ProviderService } from './provider.service'
import { RestMetadataService } from './restmetadata.service'
import { Configuration, MetaservicesApi } from '../../gen/fetch/xrd'
import {
  RestMetaservicesApi,
  Configuration as RestConfiguration,
} from '../../gen/fetch/xrd-rest'

const XROAD_BASE_PATH = process.env.XROAD_BASE_PATH
const XROAD_CLIENT = process.env.XROAD_CLIENT_ID

@Module({
  controllers: [],
  providers: [
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
              'X-Road-Client': XROAD_CLIENT,
            },
          }),
        ),
    },
    ProviderService,
    RestMetadataService,
  ],
  exports: [ProviderService, RestMetadataService],
})
export class ApiCatalogueServicesModule {}
