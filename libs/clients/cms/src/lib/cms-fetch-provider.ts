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
import { CmsConfig } from './cms.config'


export const CmsFetchProviderKey = 'CmsFetchProviderKey'

export const CmsFetchProvider: Provider<EnhancedFetchAPI> = {
  provide: CmsFetchProviderKey,
  scope: LazyDuringDevScope,
  useFactory: async (
    config: ConfigType<typeof CmsConfig>,
  ) =>
    createEnhancedFetch({
      name: 'clients-cms',
      cache: await getCache(config),
    }),
  inject: [CmsConfig.KEY],
}
