import { createRedisCacheManager } from '@island.is/cache'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import { FactoryProvider } from '@nestjs/common'
import { LicenseConfig } from './license.config'

export const LICENSE_SERVICE_CACHE_MANAGER_PROVIDER =
  'license_service_cache_manager_provider'

export const LicenseCacheProvider: FactoryProvider = {
  provide: LICENSE_SERVICE_CACHE_MANAGER_PROVIDER,
  scope: LazyDuringDevScope,
  useFactory: (licenseServiceConfig: ConfigType<typeof LicenseConfig>) => {
    if (process.env.NODE_ENV !== 'production') {
      return undefined
    }
    return createRedisCacheManager({
      name: 'license_service_cache_manager',
      nodes: licenseServiceConfig.redis.nodes,
      ssl: licenseServiceConfig.redis.ssl,
      ttl: licenseServiceConfig.redis.cacheTtl,
    })
  },
  inject: [LicenseConfig.KEY],
}
