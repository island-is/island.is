import { Inject, Module } from '@nestjs/common'
import { ShipRegistryClientService } from './ship-registry.service'
import { XRoadConfig } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'
import { client } from '../../gen/fetch/client.gen'
import { ShipRegistryClientConfig } from './ship-registry.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

@Module({
  providers: [ShipRegistryClientService],
  exports: [ShipRegistryClientService],
})
export class ShipRegistryClientModule {
  constructor(
    @Inject(XRoadConfig.KEY)
    xroadConfig: ConfigType<typeof XRoadConfig>,
    @Inject(ShipRegistryClientConfig.KEY)
    config: ConfigType<typeof ShipRegistryClientConfig>,
  ) {
    client.setConfig({
      baseUrl: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
        Accept: 'application/json',
      },
      fetch: createEnhancedFetch({
        name: 'clients-ship-registry',
        organizationSlug: 'samgongustofa',
        authSource: 'context',
      }),
    })
  }
}
