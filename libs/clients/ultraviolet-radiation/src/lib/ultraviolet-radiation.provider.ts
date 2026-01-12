import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import {
  buildCacheControl,
  createEnhancedFetch,
} from '@island.is/clients/middlewares'
import { Configuration, DefaultApi } from '../../gen/fetch'
import { UltravioletRadiationClientConfig } from './ultraviolet-radiation.config'
import { caching } from 'cache-manager'
import { createRedisCacheManager } from '@island.is/cache'

const getCacheManager = (
  config: ConfigType<typeof UltravioletRadiationClientConfig>,
  ttl: number,
) => {
  if (config.redis.nodes.length === 0) {
    return caching('memory', {
      ttl,
    })
  }

  return createRedisCacheManager({
    name: 'clients-ultraviolet-radiation',
    nodes: config.redis.nodes,
    ssl: config.redis.ssl,
    noPrefix: true,
    ttl,
  })
}

const fetchFactory = async (
  config: ConfigType<typeof UltravioletRadiationClientConfig>,
  ttl: number,
  staleWhileRevalidate: number,
  staleWhileError: number,
) => {
  // Convert milliseconds to seconds
  const maxAgeInSeconds = ttl / 1000
  const staleWhileRevalidateInSeconds = staleWhileRevalidate / 1000
  const staleWhileErrorInSeconds = staleWhileError / 1000

  return new Configuration({
    headers: {
      'x-api-key': config.apiKey,
      Accept: 'application/json',
    },
    fetchApi: createEnhancedFetch({
      name: 'clients-ultraviolet-radiation',
      organizationSlug: 'geislavarnir-rikisins',
      cache: {
        cacheManager: await getCacheManager(config, ttl),
        overrideCacheControl: () =>
          buildCacheControl({
            maxAge: maxAgeInSeconds,
            sharedMaxAge: maxAgeInSeconds,
            staleWhileRevalidate: staleWhileRevalidateInSeconds,
            staleIfError: staleWhileErrorInSeconds,
            public: true,
          }),
      },
    }),
  })
}

export const HourlyApiConfig = {
  provide: 'UltravioletRadiationClientLatestMeasurementConfig',
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof UltravioletRadiationClientConfig>) => {
    const ttl = 7 * 60 * 1000 // 7 minutes in milliseconds
    return fetchFactory(config, ttl, ttl * 2, ttl * 10)
  },
  inject: [UltravioletRadiationClientConfig.KEY],
}

export const DailyApiConfig = {
  provide: 'UltravioletRadiationClientMeasurementSeriesConfig',
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof UltravioletRadiationClientConfig>) => {
    const ttl = 12 * 60 * 60 * 1000 // 12 hours in milliseconds
    return fetchFactory(config, ttl, ttl * 2, ttl * 10)
  },
  inject: [UltravioletRadiationClientConfig.KEY],
}

export const HourlyApiCache = 'HourlyApiUVCache'
export const DailyApiCache = 'DailyApiCache'

export const ApiProviders = [
  {
    provide: HourlyApiCache,
    useFactory: (config: Configuration) => new DefaultApi(config),
    inject: [HourlyApiConfig.provide],
  },
  {
    provide: DailyApiCache,
    useFactory: (config: Configuration) => new DefaultApi(config),
    inject: [DailyApiConfig.provide],
  },
]
