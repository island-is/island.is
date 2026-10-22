import { Inject, Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'

import { client } from '../../gen/fetch/client.gen'
import { RskKilometerFeeClientConfig } from './kilometerFee.config'
import { RskKilometerFeeClientService } from './kilometerFee.service'

@Module({
  providers: [RskKilometerFeeClientService],
  exports: [RskKilometerFeeClientService],
})
export class RskKilometerFeeClientModule {
  constructor(
    @Inject(XRoadConfig.KEY)
    xroadConfig: ConfigType<typeof XRoadConfig>,
    @Inject(RskKilometerFeeClientConfig.KEY)
    config: ConfigType<typeof RskKilometerFeeClientConfig>,
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
        name: 'clients-rsk-kilometer-fee',
        organizationSlug: 'skatturinn',
        authSource: 'context',
        autoAuth: idsClientConfig.isConfigured
          ? {
              mode: 'tokenExchange',
              issuer: idsClientConfig.issuer,
              clientId: idsClientConfig.clientId,
              clientSecret: idsClientConfig.clientSecret,
              // Skatturinn will add a dedicated scope later
              scope: [],
            }
          : undefined,
      }),
    })
  }
}
