import { LazyDuringDevScope } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { SecurityApi, VerdictApi, Configuration } from '../../gen/fetch'
import { VerdictsClientConfig } from './verdicts-client.config'

export const ApiConfig = {
  provide: 'VerdictsClientConfig',
  scope: LazyDuringDevScope,
  useFactory: () => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-gopro-verdicts',
        logErrorResponseBody: true,
      }),
      headers: {
        Accept: 'application/json',
      },
    })
  },
  inject: [VerdictsClientConfig.KEY],
}

export const ApiProviders = [SecurityApi, VerdictApi].map((api) => ({
  provide: api,
  useFactory: (config: Configuration) => {
    return new api(config)
  },
  inject: [ApiConfig.provide],
}))
