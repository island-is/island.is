import { SyslumennApi, Configuration } from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const exportedApis = [SyslumennApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
