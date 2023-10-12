import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Provider } from '@nestjs/common'
import { Configuration, StarfsleyfiAMinumSidumApi } from '../../gen/fetch'
import { HealthDirectorateClientConfig } from './client.config'

export const HealthDirectorateApiProvider: Provider<StarfsleyfiAMinumSidumApi> =
  {
    provide: StarfsleyfiAMinumSidumApi,
    scope: LazyDuringDevScope,
    useFactory: (
      xroadConfig: ConfigType<typeof XRoadConfig>,
      config: ConfigType<typeof HealthDirectorateClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
    ) =>
      new StarfsleyfiAMinumSidumApi(
        new Configuration({
          fetchApi: createEnhancedFetch({
            name: 'clients-health-directorate',
            autoAuth: idsClientConfig.isConfigured
              ? {
                  mode: 'tokenExchange',
                  issuer: idsClientConfig.issuer,
                  clientId: idsClientConfig.clientId,
                  clientSecret: idsClientConfig.clientSecret,
                  scope: config.fetch.scope,
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
    inject: [
      XRoadConfig.KEY,
      HealthDirectorateClientConfig.KEY,
      IdsClientConfig.KEY,
    ],
  }
