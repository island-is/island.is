import { Configuration, SkipApi, StadaSkipsApi } from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const apiProviders = [SkipApi, StadaSkipsApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
