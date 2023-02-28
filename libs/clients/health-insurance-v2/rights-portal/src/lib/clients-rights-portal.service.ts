import { Configuration, BaseAPI } from '../../gen/fetch'
import { Provider } from '@nestjs/common'
import {
  ConfigType,
  LazyDuringDevScope,
  IdsClientConfig,
} from '@island.is/nest/config'
import { RightsPortalClientConfig } from './clients-rights-portal.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export const RightsPortalApiProvider: Provider<BaseAPI> = {
  provide: BaseAPI,
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof RightsPortalClientConfig>) =>
    new BaseAPI(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-rights-portal',
          timeout: config.fetch.timeout,
          autoAuth: undefined,
        }),

        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    ),

  inject: [RightsPortalClientConfig.KEY, IdsClientConfig.KEY],
}
