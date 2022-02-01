import { Configuration, FasteignirApi } from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const exportedApis = [FasteignirApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
