import { Inject, Module } from '@nestjs/common'
import type { ConfigType } from '@island.is/nest/config'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { client } from '../../gen/fetch/client.gen'
import { NvsPermitsClientConfig } from './nvs-permits.config'
import { NvsPermitsClientService } from './nvs-permits.service'

@Module({
  providers: [NvsPermitsClientService],
  exports: [NvsPermitsClientService],
})
export class NvsPermitsClientModule {
  constructor(
    @Inject(XRoadConfig.KEY)
    xroadConfig: ConfigType<typeof XRoadConfig>,
    @Inject(NvsPermitsClientConfig.KEY)
    config: ConfigType<typeof NvsPermitsClientConfig>,
    @Inject(IdsClientConfig.KEY)
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) {
    client.setConfig({
      baseUrl: `${xroadConfig.xRoadBasePath}/r1/${config.xroadPath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
        Accept: 'application/json',
      },
      fetch: createEnhancedFetch({
        name: 'clients-nvs-permits',
        organizationSlug: 'natturuverndarstofnun',
        logErrorResponseBody: true,
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
