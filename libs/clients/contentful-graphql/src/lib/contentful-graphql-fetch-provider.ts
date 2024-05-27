import { Provider } from '@nestjs/common'
import {
  createEnhancedFetch,
  type EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import {
  LazyDuringDevScope,
} from '@island.is/nest/config'

export const ContentfulGraphQLFetchProviderKey = 'ContentfulGraphQLFetchProviderKey'

export const ContentfulGraphQLFetchProvider: Provider<EnhancedFetchAPI> = {
  provide: ContentfulGraphQLFetchProviderKey,
  scope: LazyDuringDevScope,
  useFactory: () =>
    createEnhancedFetch({
      name: 'clients-contentful-graphql',
      // autoAuth: undefined
    }),
  inject: [ContentfulGraphQLFetchProviderKey],
}
