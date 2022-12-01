import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
} from '@island.is/nest/config'

import { AdminApi, Configuration, UsersApi } from '../../gen/fetch'
import { AirDiscountSchemeClientConfig } from './air-discount-scheme.config'

const provideApi = <T>(
  Api: new (configuration: Configuration) => T,
): Provider<T> => ({
  provide: Api,
  scope: LazyDuringDevScope,
  useFactory: (
    config: ConfigType<typeof AirDiscountSchemeClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new Api(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-air-discount-scheme',
          timeout: config.timeout,
          logErrorResponseBody: true,
          autoAuth: idsClientConfig.isConfigured
            ? {
                mode: 'auto',
                issuer: idsClientConfig.issuer,
                clientId: idsClientConfig.clientId,
                clientSecret: idsClientConfig.clientSecret,
                scope: config.tokenExchangeScope,
              }
            : undefined,
        }),
        basePath: config.basePath,
        headers: {
          Accept: 'application/json',
        },
      }),
    ),
  inject: [AirDiscountSchemeClientConfig.KEY, IdsClientConfig.KEY],
})

export const UsersApiProvider = provideApi(UsersApi)
export const AdminApiProvider = provideApi(AdminApi)
