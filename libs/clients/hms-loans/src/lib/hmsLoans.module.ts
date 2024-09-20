import { HmsScope } from '@island.is/auth/scopes'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  type ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { Inject, Module } from '@nestjs/common'
import { client } from '../../gen/fetch'
import { HmsLoansClientConfig } from './hmsLoans.config'
import { HmsLoansClientService } from './hmsLoans.service'

@Module({
  providers: [HmsLoansClientService],
  exports: [HmsLoansClientService],
})
export class HmsLoansClientModule {
  constructor(
    @Inject(XRoadConfig.KEY)
    xroadConfig: ConfigType<typeof XRoadConfig>,
    @Inject(XRoadConfig.KEY)
    config: ConfigType<typeof HmsLoansClientConfig>,
    @Inject(XRoadConfig.KEY)
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) {
    client.setConfig({
      fetch: createEnhancedFetch({
        name: 'clients-hms-loans',
        organizationSlug: 'hms',
        logErrorResponseBody: true,
        autoAuth: idsClientConfig.isConfigured
          ? {
              mode: 'tokenExchange',
              issuer: idsClientConfig.issuer,
              clientId: idsClientConfig.clientId,
              clientSecret: idsClientConfig.clientSecret,
              scope: [HmsScope.loans],
            }
          : undefined,
        timeout: 30000,
      }),
      baseUrl: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
        Accept: 'application/json',
      },
    })
  }
}
