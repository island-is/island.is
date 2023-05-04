import { Configuration, MajorsApi } from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const exportedApis = [MajorsApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
