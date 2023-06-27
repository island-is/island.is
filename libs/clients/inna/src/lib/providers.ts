import { Configuration, DefaultApi } from '../../gen/fetch'
import { ApiConfig } from './apiConfig'

export const exportedApis = [DefaultApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfig.provide],
}))
