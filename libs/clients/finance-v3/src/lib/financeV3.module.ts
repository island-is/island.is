import { Inject, Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { client } from '../../gen/fetch/client.gen'
import { FinanceClientV3Config } from './financeV3.config'
import { FinanceClientV3Service } from './financeV3.service'

@Module({
  imports: [IdsClientConfig.registerOptional()],
  providers: [FinanceClientV3Service],
  exports: [FinanceClientV3Service],
})
export class FinanceClientV3Module {
  constructor(
    @Inject(XRoadConfig.KEY)
    xroadConfig: ConfigType<typeof XRoadConfig>,
    @Inject(FinanceClientV3Config.KEY)
    config: ConfigType<typeof FinanceClientV3Config>,
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
        name: 'clients-finance-v3',
        organizationSlug: 'fjarsysla-rikisins',
        authSource: 'context',
        timeout: config.fetchTimeout,
        // 'auto' exchanges the user's token when a user is in the auth context
        // and falls back to client credentials for machine calls (e.g. payDebt).
        autoAuth: idsClientConfig.isConfigured
          ? {
              mode: 'auto',
              issuer: idsClientConfig.issuer,
              clientId: idsClientConfig.clientId,
              clientSecret: idsClientConfig.clientSecret,
              scope: ['@fjs.is/finance'],
            }
          : undefined,
      }),
    })
  }
}
