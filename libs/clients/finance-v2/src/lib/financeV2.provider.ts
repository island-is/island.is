import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { Provider } from '@nestjs/common'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration, DefaultApi } from '../../gen/fetch'
import { FinanceClientV2Config } from './financeV2.config'

export const FinanceClientV2Provider: Provider<DefaultApi> = {
  provide: DefaultApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof FinanceClientV2Config>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new DefaultApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'FJS-financeIsland_V2',
          organizationSlug: 'fjarsysla-rikisins',
          logErrorResponseBody: true,
          autoAuth: idsClientConfig.isConfigured
            ? {
                mode: 'tokenExchange',
                issuer: idsClientConfig.issuer,
                clientId: idsClientConfig.clientId,
                clientSecret: idsClientConfig.clientSecret,
                scope: ['@fjs.is/finance'],
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
  inject: [XRoadConfig.KEY, FinanceClientV2Config.KEY, IdsClientConfig.KEY],
}
