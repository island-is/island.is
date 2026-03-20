import { Inject, Injectable, Module } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import {
  FEATURE_FLAG_CLIENT,
  type FeatureFlagClient,
} from '@island.is/nest/feature-flags'
import { GraphqlCacheKeyModule } from './cache-key.module'
import {
  GRAPHQL_CACHE_KEY_PROVIDERS,
  GraphqlCacheKeyProvider,
} from './cache-key-provider'

const mockFeatureFlagClient = {
  getValue: jest.fn().mockResolvedValue(false),
  dispose: jest.fn(),
}

@Injectable()
class TestProviderA implements GraphqlCacheKeyProvider {
  operationNames = ['OperationA']
  async getCacheKeyData(_requestContext: any) {
    return 'a'
  }
}

@Injectable()
class TestProviderB implements GraphqlCacheKeyProvider {
  operationNames = ['OperationB']
  async getCacheKeyData(_requestContext: any) {
    return 'b'
  }
}

@Injectable()
class TestProviderWithDeps implements GraphqlCacheKeyProvider {
  operationNames = ['OperationWithDeps']

  constructor(
    @Inject(FEATURE_FLAG_CLIENT)
    public readonly featureFlagClient: FeatureFlagClient,
  ) {}

  async getCacheKeyData(_requestContext: any) {
    const value = await this.featureFlagClient.getValue('testFlag', false, {
      id: 'test',
      attributes: {},
    })
    return String(value)
  }
}

/**
 * A consuming module that injects GRAPHQL_CACHE_KEY_PROVIDERS.
 * If the token is not exported by GraphqlCacheKeyModule, Nest will
 * fail to resolve the dependency and the test will error.
 */
@Injectable()
class ConsumerService {
  constructor(
    @Inject(GRAPHQL_CACHE_KEY_PROVIDERS)
    public readonly providers: GraphqlCacheKeyProvider[],
  ) {}
}

@Module({
  imports: [GraphqlCacheKeyModule.register([TestProviderA])],
  providers: [ConsumerService],
})
class ConsumingModule {}

describe('GraphqlCacheKeyModule', () => {
  it('exports GRAPHQL_CACHE_KEY_PROVIDERS so consuming modules can inject it', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConsumingModule],
    })
      .overrideProvider(FEATURE_FLAG_CLIENT)
      .useValue(mockFeatureFlagClient)
      .compile()

    const consumer = moduleRef.get(ConsumerService)

    expect(consumer.providers).toHaveLength(1)
    expect(consumer.providers[0]).toBeInstanceOf(TestProviderA)
    expect(consumer.providers[0].operationNames).toEqual(['OperationA'])
  })

  it('registers multiple class providers and returns all as an array', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        GraphqlCacheKeyModule.register([TestProviderA, TestProviderB]),
      ],
    })
      .overrideProvider(FEATURE_FLAG_CLIENT)
      .useValue(mockFeatureFlagClient)
      .compile()

    const providers = moduleRef.get<GraphqlCacheKeyProvider[]>(
      GRAPHQL_CACHE_KEY_PROVIDERS,
    )

    expect(providers).toHaveLength(2)
    expect(providers[0]).toBeInstanceOf(TestProviderA)
    expect(providers[1]).toBeInstanceOf(TestProviderB)
  })

  it('providers receive their injected dependencies', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [GraphqlCacheKeyModule.register([TestProviderWithDeps])],
    })
      .overrideProvider(FEATURE_FLAG_CLIENT)
      .useValue(mockFeatureFlagClient)
      .compile()

    const providers = moduleRef.get<GraphqlCacheKeyProvider[]>(
      GRAPHQL_CACHE_KEY_PROVIDERS,
    )

    expect(providers).toHaveLength(1)
    const provider = providers[0] as TestProviderWithDeps
    expect(provider.featureFlagClient).toBe(mockFeatureFlagClient)

    const result = await provider.getCacheKeyData({} as any)
    expect(result).toBe('false')
    expect(mockFeatureFlagClient.getValue).toHaveBeenCalled()
  })
})
