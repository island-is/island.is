import { Provider } from '@nestjs/common'
import {
  createEnhancedFetch,
  type EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import {
  LazyDuringDevScope,
} from '@island.is/nest/config'

export const ContentfulFetchProviderKey = 'ContentfulFetchProviderKey'

export const ContentfulFetchProvider: Provider<EnhancedFetchAPI> = {
  provide: ContentfulFetchProviderKey,
  scope: LazyDuringDevScope,
  useFactory: () =>
    createEnhancedFetch({
      name: 'clients-contentful-graphql',
      // autoAuth: undefined
    }),
  inject: [ContentfulFetchProviderKey],
}
