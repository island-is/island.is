import { createRedisCacheManager } from '@island.is/cache'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import { FactoryProvider } from '@nestjs/common'
import { LicenseServiceConfig } from '../licenseService.config'
import { LICENSE_SERVICE_CACHE_MANAGER_PROVIDER } from '../licenseService.constants'

export const CacheProvider: FactoryProvider = {
  provide: LICENSE_SERVICE_CACHE_MANAGER_PROVIDER,
  scope: LazyDuringDevScope,
  useFactory: (licenseServiceConfig: ConfigType<typeof LicenseServiceConfig>) =>
    createRedisCacheManager({
      name: 'license_service_cache_manager',
      nodes: licenseServiceConfig.redis.nodes,
      ssl: licenseServiceConfig.redis.ssl,
      ttl: licenseServiceConfig.redis.cacheTtl,
    }),
  inject: [LicenseServiceConfig.KEY],
}
