import { Configuration, DomainsApi, MeDelegationsApi } from '../../gen/fetch'
import { ApiConfiguration } from './api-configuration'

export const exportedApis = [MeDelegationsApi, DomainsApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => new Api(configuration),
  inject: [ApiConfiguration.provide],
}))
