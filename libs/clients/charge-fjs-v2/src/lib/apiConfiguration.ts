import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  XRoadConfig,
  IdsClientConfig,
} from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { ChargeFjsV2ClientConfig } from './chargeFjsV2Client.config'

export const ApiConfiguration = {
  provide: 'ChargeFjsV2ClientApiConfiguration',
  useFactory: (
    config: ConfigType<typeof ChargeFjsV2ClientConfig>,
    xroadConfig: ConfigType<typeof XRoadConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-charge-fjs-v2',
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
  inject: [ChargeFjsV2ClientConfig.KEY, XRoadConfig.KEY, IdsClientConfig.KEY],
}
