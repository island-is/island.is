import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'

import { Configuration, UsersApi } from '../../gen/fetch'
import { AirDiscountSchemeClientConfig } from './air-discount-scheme.config'

export const AirDiscountSchemeApiProvider: Provider<UsersApi> = {
  provide: UsersApi,
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof AirDiscountSchemeClientConfig>) =>
    new UsersApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-air-discount-scheme',
          ...config.fetch,
        }),
        basePath: `http://localhost:4248`,
        headers: {
          //'X-Road-Client': xroadConfig.xRoadClient,
          Accept: 'application/json',
        },
      }),
    ),
  inject: [AirDiscountSchemeClientConfig.KEY],
}
