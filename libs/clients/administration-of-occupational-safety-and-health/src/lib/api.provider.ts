import { LazyDuringDevScope } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { NamskeidApi, Configuration } from '../../gen/fetch'

export const ApiConfig = {
  provide: 'AdministrationOfOccupationalSafetyAndHealthClientConfig',
  scope: LazyDuringDevScope,
  useFactory: () => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-administration-of-occupational-safety-and-health',
        logErrorResponseBody: true,
        treat400ResponsesAsErrors: true,
        organizationSlug: 'vinnueftirlitid',
      }),
      basePath: 'https://ws.ver.is/namskeid',
      headers: {
        Accept: 'application/json',
      },
    })
  },
}

export const ApiProviders = [NamskeidApi].map((api) => ({
  provide: api,
  useFactory: (config: Configuration) => {
    return new api(config)
  },
  inject: [ApiConfig.provide],
}))
