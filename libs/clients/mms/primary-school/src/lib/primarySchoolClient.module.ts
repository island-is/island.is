import { Inject, Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { client } from '../../gen/fetch/client.gen'
import { PrimarySchoolClientConfig } from './primarySchoolClient.config'
import { PrimarySchoolClientService } from './primarySchoolClient.service'

@Module({
  providers: [PrimarySchoolClientService],
  exports: [PrimarySchoolClientService],
})
export class PrimarySchoolClientModule {
  constructor(
    @Inject(XRoadConfig.KEY)
    xroadConfig: ConfigType<typeof XRoadConfig>,
    @Inject(PrimarySchoolClientConfig.KEY)
    config: ConfigType<typeof PrimarySchoolClientConfig>,
    @Inject(IdsClientConfig.KEY)
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) {
    client.setConfig({
      baseUrl: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
        Accept: 'application/json',
      },
      fetch: createEnhancedFetch({
        name: 'clients-mms-primary-school',
        organizationSlug: 'midstod-menntunar-og-skolathjonustu',
        authSource: 'context',
        autoAuth: idsClientConfig.isConfigured
          ? {
              mode: 'tokenExchange',
              issuer: idsClientConfig.issuer,
              clientId: idsClientConfig.clientId,
              clientSecret: idsClientConfig.clientSecret,
              scope: [],
            }
          : undefined,
      }),
    })
  }
}
