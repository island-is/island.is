import { Inject, Module } from '@nestjs/common'
import { PoliceCasesClientService } from './policeCases.service'
import { XRoadConfig, IdsClientConfig } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'
import { client } from '../../gen/fetch/client.gen'
import { PoliceCasesClientConfig } from './policeCases.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'

@CodeOwner(CodeOwners.Hugsmidjan)
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
      fetch: createEnhancedFetch({
        name: 'clients-police-cases',
        organizationSlug: 'rikislogreglustjori',
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
      baseUrl: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
        'x-api-key': config.xRoadPoliceCasesApiKey,
        Accept: 'application/json',
      }
    })
  }
}
