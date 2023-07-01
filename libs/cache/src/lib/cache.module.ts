/**
 * UPGRADE WARNING:
 * Backported @nestjs/common@9.2 cache module to support cache-manager v5. Only
 * supports static registration. Async registration depends on
 * ConfigurableModuleBuilder which is not available in nest v8.
 *
 * TODO: Remove this after upgrading to nest v9.2
 */

import { CACHE_MANAGER, DynamicModule, Module, Provider } from '@nestjs/common'
import { defaultCacheOptions } from '@nestjs/common/cache/default-options'
import { CacheStoreFactory } from '@nestjs/common/cache/interfaces/cache-manager.interface'
import { loadPackage } from '@nestjs/common/utils/load-package.util'

const MODULE_OPTIONS_TOKEN = 'CACHE_OPTIONS_TOKEN'

interface CacheStore {
  set<T>(
    key: string,
    value: T,
    options?: CacheStoreSetOptions<T> | number,
  ): Promise<void> | void
  get<T>(key: string): Promise<T | undefined> | T | undefined
  del?(key: string): void | Promise<void>
}

export interface CacheStoreSetOptions<T> {
  /**
   * Time to live - amount of time in seconds that a response is cached before it
   * is deleted. Defaults based on your cache manager settings.
   */
  ttl?: ((value: T) => number) | number
}

interface CacheManagerOptions {
  /**
   * Cache storage manager.  Default is `'memory'` (in-memory store).  See
   * [Different stores](https://docs.nestjs.com/techniques/caching#different-stores)
   * for more info.
   */
  store?: string | CacheStoreFactory | CacheStore
  /**
   * Time to live - amount of time that a response is cached before it
   * is deleted. Subsequent request will call through the route handler and refresh
   * the cache.  Defaults to 5 seconds. In `cache-manager@^4` this value is in seconds.
   * In `cache-manager@^5` this value is in milliseconds.
   */
  ttl?: number
  /**
   * Maximum number of responses to store in the cache.  Defaults to 100.
   */
  max?: number
  isCacheableValue?: (value: any) => boolean
}

type CacheModuleOptions<
  StoreConfig extends Record<any, any> = Record<string, any>,
> =
  // Store-specific configuration takes precedence over cache module options due
  // to how `createCacheManager` is implemented.
  CacheManagerOptions &
    StoreConfig & {
      /**
       * If "true', register `CacheModule` as a global module.
       */
      isGlobal?: boolean
    }

function createCacheManager(): Provider {
  return {
    provide: CACHE_MANAGER,
    // eslint-disable-next-line local-rules/no-async-module-init
    useFactory: async (options: CacheManagerOptions) => {
      const cacheManager = loadPackage('cache-manager', 'CacheModule', () =>
        require('cache-manager'),
      )
      const cacheManagerIsv5OrGreater = 'memoryStore' in cacheManager
      const cachingFactory = async (
        store: CacheManagerOptions['store'],
        options: Omit<CacheManagerOptions, 'store'>,
      ): Promise<Record<string, any>> => {
        if (!cacheManagerIsv5OrGreater) {
          return cacheManager.caching({
            ...defaultCacheOptions,
            ...{ ...options, store },
          })
        }
        let cache: string | Function | CacheStore = 'memory'
        defaultCacheOptions.ttl *= 1000
        if (typeof store === 'object') {
          if ('create' in store) {
            cache = store.create
          } else {
            cache = store
          }
        } else if (typeof store === 'function') {
          cache = store
        }
        return cacheManager.caching(cache, {
          ...defaultCacheOptions,
          ...options,
        })
      }

      return Array.isArray(options)
        ? cacheManager.multiCaching(
            await Promise.all(
              options.map((option) => cachingFactory(option.store, option)),
            ),
          )
        : cachingFactory(options.store, options)
    },
    inject: [MODULE_OPTIONS_TOKEN],
  }
}

/**
 * Module that provides Nest cache-manager.
 *
 * @see [Caching](https://docs.nestjs.com/techniques/caching)
 * @publicApi
 */
@Module({
  providers: [createCacheManager()],
  exports: [CACHE_MANAGER],
})
export class CacheModule {
  /**
   * Configure the cache manager statically.
   *
   * @param options options to configure the cache manager
   *
   * @see [Customize caching](https://docs.nestjs.com/techniques/caching#customize-caching)
   */
  static register<StoreConfig extends Record<any, any> = Record<string, any>>(
    options: CacheModuleOptions<StoreConfig> = {} as any,
  ): DynamicModule {
    return {
      module: CacheModule,
      global: options.isGlobal,
      providers: [{ provide: MODULE_OPTIONS_TOKEN, useValue: options }],
    }
  }
}
