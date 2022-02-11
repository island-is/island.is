import { ApiConfiguration } from './apiConfiguration'
import { Configuration, SkipApi, UmsoknirApi, UtgerdirApi } from './gen/fetch'

export const exportedApis = [SkipApi, UmsoknirApi, UtgerdirApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
