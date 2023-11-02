import { Configuration, ConsentsApi } from '../../gen/fetch'
import { ApiConfiguration } from './api-configuration'

export const exportedApis = [ConsentsApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => new Api(configuration),
  inject: [ApiConfiguration.provide],
}))
