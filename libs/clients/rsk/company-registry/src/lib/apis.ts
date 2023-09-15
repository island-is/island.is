import { ApiConfiguration } from './apiConfiguration'
import { DefaultApi, Configuration } from './gen/fetch'

export const exportedApis = [DefaultApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
