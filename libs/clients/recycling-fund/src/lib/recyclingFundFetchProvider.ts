import { Provider } from '@nestjs/common'

import { RecyclingFundScope } from '@island.is/auth/scopes'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
} from '@island.is/nest/config'

export const RecyclingFundFetchKey = 'RecyclingFundFetchProviderKey'

export const RecyclingFundFetchProvider: Provider<EnhancedFetchAPI> = {
  provide: RecyclingFundFetchKey,
  scope: LazyDuringDevScope,
  useFactory: (idsClientConfig: ConfigType<typeof IdsClientConfig>) =>
    createEnhancedFetch({
      name: 'clients-recycling-fund',
      autoAuth: {
        mode: 'tokenExchange',
        issuer: idsClientConfig.issuer,
        clientId: idsClientConfig.clientId,
        clientSecret: idsClientConfig.clientSecret,
        scope: [RecyclingFundScope.recyclingFund],
      },
    }),
  inject: [IdsClientConfig.KEY],
}
