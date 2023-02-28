import { Configuration, SessionsApi } from '../../gen/fetch'
import { ApiConfiguration } from './api-configuration'

export const exportedApis = [SessionsApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => new Api(configuration),
  inject: [ApiConfiguration.provide],
}))
