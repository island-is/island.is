import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { BloodClientConfig } from './blood.config'
import { Provider } from '@nestjs/common'
import { BloodApi, Configuration } from '../../gen/fetch'

export const BloodApiProvider: Provider<BloodApi> = {
  provide: BloodApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof BloodClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new BloodApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-blood',
          organizationSlug: 'landspitali',
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
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.baseUrl}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Road-Client': xroadConfig.xRoadClient,
        },
      }),
    ),
  inject: [XRoadConfig.KEY, BloodClientConfig.KEY, IdsClientConfig.KEY],
}
