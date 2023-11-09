import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { Provider } from '@nestjs/common'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration, LibraApi } from '../../gen/fetch'
import { HmsLoansClientConfig } from './hmsLoans.config'

export const HmsLoansApiProvider: Provider<LibraApi> = {
  provide: LibraApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof HmsLoansClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new LibraApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-hms-loans',
          organizationSlug: 'husnaedis-og-mannvirkjastofnun',
          logErrorResponseBody: true,
          autoAuth: idsClientConfig.isConfigured
            ? {
                mode: 'tokenExchange',
                issuer: idsClientConfig.issuer,
                clientId: idsClientConfig.clientId,
                clientSecret: idsClientConfig.clientSecret,
                scope: config.tokenExchangeScope,
              }
            : undefined,
        }),
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        headers: {
          'X-Road-Client': xroadConfig.xRoadClient,
          Accept: 'application/json',
        },
      }),
    ),
  inject: [XRoadConfig.KEY, HmsLoansClientConfig.KEY, IdsClientConfig.KEY],
}
