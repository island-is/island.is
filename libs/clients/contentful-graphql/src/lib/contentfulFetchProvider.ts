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

export const ContentfulFetchProviderKey = 'ContentfulFetchProviderKey'

export const ContentfulFetchProvider: Provider<EnhancedFetchAPI> = {
  provide: ContentfulFetchProviderKey,
  scope: LazyDuringDevScope,
  useFactory: (idsClientConfig: ConfigType<typeof IdsClientConfig>) =>
    createEnhancedFetch({
      name: 'clients-contentful-graphql',
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
