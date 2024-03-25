import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { Provider } from '@nestjs/common'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { PaymentApi, Configuration } from '../../gen/fetch'
import { HousingBenefitsConfig } from './hms-housing-benefits.config'

export const HmsHousingBenefitsApiProvider: Provider<PaymentApi> = {
  provide: PaymentApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof HousingBenefitsConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new PaymentApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-hms-housing-benefits',
          organizationSlug: 'hms',
          autoAuth: idsClientConfig.isConfigured
            ? {
                mode: 'tokenExchange',
                issuer: idsClientConfig.issuer,
                clientId: idsClientConfig.clientId,
                clientSecret: idsClientConfig.clientSecret,
                scope: config.tokenExchangeScope,
              }
            : undefined,
          timeout: config.fetchTimeout,
        }),
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        headers: {
          'X-Road-Client': xroadConfig.xRoadClient,
          Accept: 'application/json',
        },
      }),
    ),
  inject: [XRoadConfig.KEY, HousingBenefitsConfig.KEY, IdsClientConfig.KEY],
}
