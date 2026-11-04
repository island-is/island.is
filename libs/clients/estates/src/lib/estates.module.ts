import { Inject, Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'

import { client } from '../../gen/fetch/client.gen'
import { EstatesClientConfig } from './estates.config'
import { EstatesClientService } from './estates.service'

@Module({
  providers: [EstatesClientService],
  exports: [EstatesClientService],
})
export class EstatesClientModule {
  constructor(
    @Inject(XRoadConfig.KEY)
    xroadConfig: ConfigType<typeof XRoadConfig>,
    @Inject(EstatesClientConfig.KEY)
    config: ConfigType<typeof EstatesClientConfig>,
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
        name: 'clients-estates',
        organizationSlug: 'syslumenn',
        authSource: 'context',
        autoAuth:
          idsClientConfig.isConfigured && config.scope.length > 0
            ? {
                mode: 'tokenExchange',
                issuer: idsClientConfig.issuer,
                clientId: idsClientConfig.clientId,
                clientSecret: idsClientConfig.clientSecret,
                scope: config.scope,
              }
            : undefined,
      }),
    })
  }
}
