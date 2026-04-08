import { Inject, Module } from '@nestjs/common'
import { ShipRegistryClientV2Service } from './ship-registry.service'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'
import { ShipRegistryClientV2Config } from './ship-registry.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { client } from '../../gen/fetch/client.gen'

@Module({
  providers: [ShipRegistryClientV2Service],
  exports: [ShipRegistryClientV2Service],
})
export class ShipRegistryClientV2Module {
  constructor(
    @Inject(XRoadConfig.KEY)
    xroadConfig: ConfigType<typeof XRoadConfig>,
    @Inject(ShipRegistryClientV2Config.KEY)
    config: ConfigType<typeof ShipRegistryClientV2Config>,
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
        name: 'clients-ship-registry-v2',
        organizationSlug: 'samgongustofa',
        authSource: 'context',
        autoAuth: idsClientConfig.isConfigured
          ? {
              mode: 'tokenExchange',
              issuer: idsClientConfig.issuer,
              clientId: idsClientConfig.clientId,
              clientSecret: idsClientConfig.clientSecret,
              scope: ['@samgongustofa.is/skutan'],
            }
          : undefined,
      }),
    })
  }
}
