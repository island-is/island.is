import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
} from '@island.is/nest/config'

import { AdminApi, Configuration, UsersApi } from '../../gen/fetch'
import { AirDiscountSchemeClientConfig } from './air-discount-scheme.config'
import { AirDiscountSchemeScope } from '@island.is/auth/scopes'

const provideApi = <T>(
  Api: new (configuration: Configuration) => T,
  scope: string[],
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
          organizationSlug: 'stafraent-island',
          timeout: config.timeout,
          logErrorResponseBody: true,
          autoAuth: idsClientConfig.isConfigured
            ? {
                mode: 'auto',
                issuer: idsClientConfig.issuer,
                clientId: idsClientConfig.clientId,
                clientSecret: idsClientConfig.clientSecret,
                scope,
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

export const UsersApiProvider = provideApi(UsersApi, [
  AirDiscountSchemeScope.default,
])
export const AdminApiProvider = provideApi(AdminApi, [
  AirDiscountSchemeScope.admin,
])
