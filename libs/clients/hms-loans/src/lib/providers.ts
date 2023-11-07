import { Configuration, LibraApi } from '../../gen/fetch'
import { ApiConfig } from './api.config'

export const apiProviders = [LibraApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfig.provide],
}))
