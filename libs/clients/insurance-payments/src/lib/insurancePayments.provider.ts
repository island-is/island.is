import { PaymentPlanApi } from '../../gen/fetch/apis'
import {
  ConfigType,
  XRoadConfig,
  LazyDuringDevScope,
  IdsClientConfig,
} from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { InsurancePaymentsClientConfig } from './insurancePayments.config'
import { Provider } from '@nestjs/common'
import { Configuration } from '../../gen/fetch'

export const InsurancePaymentsApiProvider: Provider<PaymentPlanApi> = {
  provide: PaymentPlanApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof InsurancePaymentsClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new PaymentPlanApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-insurance-payments',
          organizationSlug: 'tryggingastofnun',
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
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        headers: {
          'X-Road-Client': xroadConfig.xRoadClient,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    ),
  inject: [
    XRoadConfig.KEY,
    InsurancePaymentsClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
