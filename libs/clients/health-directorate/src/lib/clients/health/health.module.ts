import { Inject, Module } from '@nestjs/common'
import type { ConfigType } from '@island.is/nest/config'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { client } from './gen/fetch/client.gen'
import { HealthDirectorateHealthService } from './health.service'
import { HealthDirectorateHealthClientConfig } from './health.config'

@Module({
  providers: [HealthDirectorateHealthService],
  exports: [HealthDirectorateHealthService],
})
export class HealthDirectorateHealthModule {
  constructor(
    @Inject(XRoadConfig.KEY)
    xroadConfig: ConfigType<typeof XRoadConfig>,
    @Inject(HealthDirectorateHealthClientConfig.KEY)
    config: ConfigType<typeof HealthDirectorateHealthClientConfig>,
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
        name: 'clients-health-directorate-health',
        organizationSlug: 'landlaeknir',
        logErrorResponseBody: true,
        authSource: 'context',
        autoAuth: idsClientConfig.isConfigured
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
