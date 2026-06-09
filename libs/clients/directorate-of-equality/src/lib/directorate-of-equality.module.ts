import { Inject, Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { client } from '../../gen/fetch/client.gen'
import { DirectorateOfEqualityClientConfig } from './directorate-of-equality.config'
import { DirectorateOfEqualityClientService } from './directorate-of-equality.service'

@Module({
  providers: [DirectorateOfEqualityClientService],
  exports: [DirectorateOfEqualityClientService],
})
export class DirectorateOfEqualityClientModule {
  constructor(
    @Inject(XRoadConfig.KEY)
    xroadConfig: ConfigType<typeof XRoadConfig>,
    @Inject(DirectorateOfEqualityClientConfig.KEY)
    config: ConfigType<typeof DirectorateOfEqualityClientConfig>,
    @Inject(IdsClientConfig.KEY)
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) {
    client.setConfig({
      baseUrl: 'http://localhost:5100',
      // baseUrl: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
        Accept: 'application/json',
      },
      fetch: createEnhancedFetch({
        name: 'clients-directorate-of-equality',
        organizationSlug: 'domsmalaraduneytid',
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
