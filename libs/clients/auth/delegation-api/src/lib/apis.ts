import {
  ClientsApi,
  Configuration,
  DomainsApi,
  MeDelegationsApi,
  ScopesApi,
} from '../../gen/fetch'
import { ApiConfiguration } from './api-configuration'

export const exportedApis = [
  MeDelegationsApi,
  DomainsApi,
  ClientsApi,
  ScopesApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => new Api(configuration),
  inject: [ApiConfiguration.provide],
}))
