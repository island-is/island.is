import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { Configuration, DefaultApi } from '../../gen/fetch'
import { UltravioletRadiationClientConfig } from './ultraviolet-radiation.config'

export const ApiConfig = {
  provide: 'UltravioletRadiationClientConfig',
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof UltravioletRadiationClientConfig>) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-ultraviolet-radiation',
        treat400ResponsesAsErrors: true,
        organizationSlug: 'geislavarnir-rikisins',
      }),
      headers: {
        'x-api-key': config.apiKey,
        Accept: 'application/json',
      },
    })
  },
  inject: [UltravioletRadiationClientConfig.KEY],
}

export const ApiProviders = [DefaultApi].map((api) => ({
  provide: api,
  useFactory: (config: Configuration) => {
    return new api(config)
  },
  inject: [ApiConfig.provide],
}))
