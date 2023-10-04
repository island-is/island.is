import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  XRoadConfig,
  IdsClientConfig,
} from '@island.is/nest/config'
import { Configuration } from '../gen/fetch'
import { PaymentScheduleClientConfig } from './payment-schedule.config'

export const ApiConfiguration = {
  provide: 'PaymentPlanClientApiConfiguration',
  useFactory: (
    config: ConfigType<typeof PaymentScheduleClientConfig>,
    xroadConfig: ConfigType<typeof XRoadConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-payment-schedule',
        organizationSlug: 'fjarsysla-rikisins',
        timeout: config.fetchTimeout,
        autoAuth: idsClientConfig.isConfigured
          ? {
              mode: 'auto',
              issuer: idsClientConfig.issuer,
              clientId: idsClientConfig.clientId,
              clientSecret: idsClientConfig.clientSecret,
              scope: config.tokenExchangeScope,
              tokenExchange: {
                requestActorToken: config.requestActorToken,
              },
            }
          : undefined,
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
      },
    })
  },
  inject: [
    PaymentScheduleClientConfig.KEY,
    XRoadConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
