import { Inject, Module } from '@nestjs/common'
import { FarmersClientService } from './farmers.service'
import { XRoadConfig, IdsClientConfig } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'
import { client } from '../../gen/fetch/client.gen'
import { FarmersClientConfig } from './farmers.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

@Module({
  providers: [FarmersClientService],
  exports: [FarmersClientService],
})
export class FarmersClientModule {
  constructor(
    @Inject(XRoadConfig.KEY)
    xroadConfig: ConfigType<typeof XRoadConfig>,
    @Inject(FarmersClientConfig.KEY)
    config: ConfigType<typeof FarmersClientConfig>,
    @Inject(IdsClientConfig.KEY)
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) {
    client.setConfig({
      //baseUrl: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      //(TEMPORARY)
      baseUrl: 'https://staging.api.afurd.is',
      headers: {
        //'X-Road-Client': xroadConfig.xRoadClient,
        Accept: 'application/json',
      },
      fetch: createEnhancedFetch({
        name: 'clients-farmers',
        organizationSlug: 'atvinnuvegaraduneytid',
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
