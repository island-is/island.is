import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import { BloodClientConfig } from './blood.config'
import { Provider } from '@nestjs/common'
import { BloodApi, Configuration } from '../../gen/fetch'

export const BloodApiProvider: Provider<BloodApi> = {
  provide: BloodApi,
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof BloodClientConfig>) =>
    new BloodApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-blood',
          organizationSlug: 'landspitali',
        }),

        basePath: config.baseUrl,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Api-Key': config.apiKey,
        },
      }),
    ),
  inject: [BloodClientConfig.KEY],
}
