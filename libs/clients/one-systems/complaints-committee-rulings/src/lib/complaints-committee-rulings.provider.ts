import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { AuthApi, Configuration } from '../../gen/fetch'
import { ComplaintsCommitteeRulingsClientConfig } from './complaints-committee-rulings.config'

export const ApiConfig = {
  provide: 'ComplaintsCommitteeRulingsClientConfig',
  scope: LazyDuringDevScope,
  useFactory: (
    config: ConfigType<typeof ComplaintsCommitteeRulingsClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-complaints-committee-rulings',
        logErrorResponseBody: true,
      }),
      basePath: `${config.basePath}/OneRulings`,
      headers: {
        Accept: 'application/json',
      },
    })
  },
  inject: [ComplaintsCommitteeRulingsClientConfig.KEY],
}

export const ApiProviders = [AuthApi].map((api) => ({
  provide: api,
  useFactory: (config: Configuration) => {
    return new api(config)
  },
  inject: [ApiConfig.provide],
}))
