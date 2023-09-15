import { AdrApi, Configuration, VinnuvelaApi } from '../../gen/fetch'
import { ApiConfig } from './api.config'

export const exportedApis = [AdrApi, VinnuvelaApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfig.provide],
}))
