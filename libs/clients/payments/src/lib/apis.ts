import { Configuration, PaymentsApi } from '../../gen/fetch'
import { ApiConfiguration } from './api-configuration'

export const exportedApis = [PaymentsApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => new Api(configuration),
  inject: [ApiConfiguration.provide],
}))
