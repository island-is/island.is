import { Provider } from '@nestjs/common'
import {
  createEnhancedFetch,
  type EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import {
  ConfigType,
  LazyDuringDevScope,
} from '@island.is/nest/config'
import { getCache } from './cache'
import { ContentfulGraphQLClientConfig } from './contentful-graphql.config'


export const ContentfulGraphQLFetchProviderKey = 'ContentfulGraphQLFetchProviderKey'

export const ContentfulGraphQLFetchProvider: Provider<EnhancedFetchAPI> = {
  provide: ContentfulGraphQLFetchProviderKey,
  scope: LazyDuringDevScope, // config 
  // Necessary because of cache-manager.
  // eslint-disable-next-line local-rules/no-async-module-init
  useFactory: async (
    config: ConfigType<typeof ContentfulGraphQLClientConfig>,
  ) =>
    createEnhancedFetch({
      name: 'clients-contentful-graphql',
      cache: await getCache(config),
      // autoAuth: undefined
    }),
  inject: [ContentfulGraphQLClientConfig.KEY],// BREAKTHROUGH ?
}
