import { Configuration, OptionSetApi } from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const exportedApis = [OptionSetApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
