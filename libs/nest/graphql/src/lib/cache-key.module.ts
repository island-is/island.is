import { DynamicModule, Module, Type } from '@nestjs/common'
import {
  GRAPHQL_CACHE_KEY_PROVIDERS,
  GraphqlCacheKeyProvider,
} from './cache-key-provider'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({})
export class GraphqlCacheKeyModule {
  static register(
    providers: Type<GraphqlCacheKeyProvider>[],
  ): DynamicModule {
    return {
      module: GraphqlCacheKeyModule,
      imports: [FeatureFlagModule],
      providers: [
        ...providers,
        {
          provide: GRAPHQL_CACHE_KEY_PROVIDERS,
          useFactory: (...instances: GraphqlCacheKeyProvider[]) => instances,
          inject: providers,
        },
      ],
      exports: [GRAPHQL_CACHE_KEY_PROVIDERS],
    }
  }
}
