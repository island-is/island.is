import { Inject, Module } from '@nestjs/common'
import { FarmersClientService } from './farmers.service'
import { XRoadConfig, IdsClientConfig } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'
import { client } from '../../gen/fetch/client.gen'
import { createQuerySerializer } from '../../gen/fetch/client/utils.gen'
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
    const defaultSerializer = createQuerySerializer()
    client.setConfig({
      baseUrl: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
        Accept: 'application/json',
      },
      querySerializer: (query) => {
        const normalized: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(query)) {
          normalized[key] =
            value instanceof Date ? value.toISOString().split('T')[0] : value
        }
        return defaultSerializer(normalized)
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
              scope: ['@atrn.is/afurd'],
            }
          : undefined,
      }),
    })
  }
}
