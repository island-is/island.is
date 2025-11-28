import { Inject, Module } from '@nestjs/common'
import { PoliceCasesClientService } from './policeCases.service'
import { XRoadConfig, IdsClientConfig } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'
import { client } from '../../gen/fetch/client.gen'
import { PoliceCasesClientConfig } from './policeCases.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

@Module({
  providers: [PoliceCasesClientService],
  exports: [PoliceCasesClientService],
})
export class PoliceCasesClientModule {
  constructor(
    @Inject(XRoadConfig.KEY)
    xroadConfig: ConfigType<typeof XRoadConfig>,
    @Inject(PoliceCasesClientConfig.KEY)
    config: ConfigType<typeof PoliceCasesClientConfig>,
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
        name: 'clients-police-cases',
        organizationSlug: 'rikislogreglustjori',
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

    client.interceptors.request.use((request) => {
      request.headers.set('X-API-KEY', config.xRoadPoliceCasesApiKey)
      return request
    })
  }
}
