import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { Provider } from '@nestjs/common'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
} from '@island.is/nest/config'
import {
  StadfangApi,
  FasteignApi,
  AdalmatseiningApi,
  Configuration,
} from '../../gen/fetch'
import { HmsConfig } from './hms.config'

const createApiProvider = <T>(
  ApiClass: new (config: Configuration) => T,
): Provider<T> => ({
  provide: ApiClass,
  scope: LazyDuringDevScope,
  useFactory: (
    config: ConfigType<typeof HmsConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new ApiClass(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-hms',
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
        basePath: config.xRoadPath,
        headers: {
          'X-Road-Client': config.xRoadClientHeader,
          Accept: 'application/json',
        },
      }),
    ),
  inject: [HmsConfig.KEY, IdsClientConfig.KEY],
})

export const HmsStadfangApiProvider = createApiProvider(StadfangApi)
export const HmsFasteignApiProvider = createApiProvider(FasteignApi)
export const HmsAdalmatseiningApiProvider = createApiProvider(AdalmatseiningApi)
