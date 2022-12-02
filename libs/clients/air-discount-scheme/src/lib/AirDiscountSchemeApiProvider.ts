import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
} from '@island.is/nest/config'

import { Configuration, UsersApi } from '../../gen/fetch'
import { AirDiscountSchemeClientConfig } from './air-discount-scheme.config'

export const AirDiscountSchemeApiProvider: Provider<UsersApi> = {
  provide: UsersApi,
  scope: LazyDuringDevScope,
  useFactory: (
    config: ConfigType<typeof AirDiscountSchemeClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new UsersApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-air-discount-scheme',
          timeout: config.timeout,
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
}
