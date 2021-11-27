import { CACHE_MANAGER, CacheModule, Module } from '@nestjs/common'
import { Cache } from 'cache-manager'

import {
  buildCacheControl,
  createEnhancedFetch,
} from '@island.is/clients/middlewares'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'

import {
  Configuration,
  EinstaklingarApi,
  FasteignirApi,
  LyklarApi,
} from '../../gen/fetch'
import { NationalRegistryClientConfig } from './NationalRegistryClientConfig'

const registryEndpoint = /\/einstaklingar\/\d{10}$/
const custodyEndpoint = /\/einstaklingar\/\d{10}\/forsja$/

const exportedApis = [EinstaklingarApi, FasteignirApi, LyklarApi].map(
  (Api) => ({
    provide: Api,
    useFactory: (
      xroadConfig: ConfigType<typeof XRoadConfig>,
      config: ConfigType<typeof NationalRegistryClientConfig>,
      cacheManager: Cache,
    ) => {
      return new Api(
        new Configuration({
          fetchApi: createEnhancedFetch({
            name: 'clients-national-registry-v2',
            cache: {
              cacheManager,
              shared: (request) => {
                // Main registry is public, rest private.
                return !!request.url.match(registryEndpoint)
              },
              overrideCacheControl: (request) => {
                if (request.url.match(registryEndpoint)) {
                  // Main registry lookup. Long cache with lazy revalidation.
                  return buildCacheControl({
                    public: true,
                    maxAge: 60 * 60 * 24, // 1 day
                    staleWhileRevalidate: 60 * 60 * 24 * 30, // 30 days
                  })
                } else if (request.url.match(custodyEndpoint)) {
                  // Sensitive information used by delegation system. Short cache and long stale-if-error.
                  return buildCacheControl({
                    maxAge: 60 * 10, // 10 minutes
                    staleIfError: 60 * 60 * 24 * 30, // 30 days
                  })
                }
                // Short private cache for the rest?
                return buildCacheControl({ maxAge: 60 * 10 })
              },
            },
            ...config.fetch,
          }),
          basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
          headers: {
            'X-Road-Client': xroadConfig.xRoadClient,
          },
        }),
      )
    },
    inject: [XRoadConfig.KEY, NationalRegistryClientConfig.KEY, CACHE_MANAGER],
  }),
)

@Module({
  providers: exportedApis,
  exports: exportedApis,
  imports: [CacheModule.register()],
})
export class NationalRegistryClientModule {}
