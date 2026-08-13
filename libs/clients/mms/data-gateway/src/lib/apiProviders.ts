import { Configuration, SchoolsApi } from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const apiProviders = [SchoolsApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => new Api(configuration),
  inject: [ApiConfiguration.provide],
}))
