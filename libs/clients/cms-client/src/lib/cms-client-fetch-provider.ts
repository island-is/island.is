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
import { CmsClientConfig } from './cms-client.config'


export const CmsClientFetchProviderKey = 'CmsClientFetchProviderKey'

export const CmsClientFetchProvider: Provider<EnhancedFetchAPI> = {
  provide: CmsClientFetchProviderKey,
  scope: LazyDuringDevScope,
  useFactory: async (
    config: ConfigType<typeof CmsClientConfig>,
  ) =>
    createEnhancedFetch({
      name: 'clients-cms-client',
      cache: await getCache(config),
    }),
  inject: [CmsClientConfig.KEY],
}
