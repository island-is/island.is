import { Provider } from '@nestjs/common'
import {
  createEnhancedFetch,
  type EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import { getCache } from './cache'
import { CmsConfig } from './cms.config'

export const CmsFetchProviderKey = 'CmsFetchProviderKey'

export const CmsFetchProvider: Provider<EnhancedFetchAPI> = {
  provide: CmsFetchProviderKey,
  scope: LazyDuringDevScope,
  // Necessary because of cache-manager.
  // eslint-disable-next-line local-rules/no-async-module-init
  useFactory: async (config: ConfigType<typeof CmsConfig>) =>
    createEnhancedFetch({
      name: 'clients-cms',
      cache: await getCache(config),
    }),
  inject: [CmsConfig.KEY],
}
