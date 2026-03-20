import { DynamicModule, Module } from '@nestjs/common'
import {
  GRAPHQL_CACHE_KEY_PROVIDERS,
  GraphqlCacheKeyProvider,
} from './cache-key-provider'

@Module({})
export class GraphqlCacheKeyModule {
  static register(
    providers: GraphqlCacheKeyProvider[],
  ): DynamicModule {
    return {
      module: GraphqlCacheKeyModule,
      providers: [
        {
          provide: GRAPHQL_CACHE_KEY_PROVIDERS,
          useValue: providers,
        },
      ],
      exports: [GRAPHQL_CACHE_KEY_PROVIDERS],
    }
  }
}
