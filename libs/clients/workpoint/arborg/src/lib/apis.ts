import { ApiConfiguration } from './apiConfiguration'
import { Configuration, ApplicationApi } from '../../gen/fetch'

export const exportedApis = [ApplicationApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
