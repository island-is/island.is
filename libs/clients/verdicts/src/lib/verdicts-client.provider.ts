import { LazyDuringDevScope } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { SecurityApi, VerdictApi, Configuration } from '../../gen/fetch'
import { VerdictsClientConfig } from './verdicts-client.config'
import { ConfigType } from '@nestjs/config'

export const ApiConfig = {
  provide: 'VerdictsClientConfig',
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof VerdictsClientConfig>) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-gopro-verdicts',
        logErrorResponseBody: true,
      }),
      headers: {
        Accept: 'application/json',
      },
      username: config.goproUsername,
      password: config.goproPassword,
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
