import { Provider } from '@nestjs/common'

import { RecyclingFundScope } from '@island.is/auth/scopes'
import {
  createEnhancedFetch,
  type EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import {
  type ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
} from '@island.is/nest/config'

export const CarRecyclingFetchProviderKey = 'CarRecyclingFetchProviderKey'

export const CarRecyclingFetchProvider: Provider<EnhancedFetchAPI> = {
  provide: CarRecyclingFetchProviderKey,
  scope: LazyDuringDevScope,
  useFactory: (idsClientConfig: ConfigType<typeof IdsClientConfig>) =>
    createEnhancedFetch({
      name: 'clients-car-recycling',
      autoAuth: idsClientConfig.isConfigured
        ? {
            mode: 'tokenExchange',
            issuer: idsClientConfig.issuer,
            clientId: idsClientConfig.clientId,
            clientSecret: idsClientConfig.clientSecret,
            scope: [RecyclingFundScope.carRecycling],
          }
        : undefined,
    }),
  inject: [IdsClientConfig.KEY],
}
