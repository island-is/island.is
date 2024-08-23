import {
  ClientsApi,
  Configuration,
  DomainsApi,
  MeDelegationsApi,
  MeLoginRestrictionsApi,
  ScopesApi,
  DelegationIndexApi,
  DelegationsApi,
  DelegationAdminApi,
} from '../../gen/fetch'
import { ApiConfiguration } from './api-configuration'

export const exportedApis = [
  MeDelegationsApi,
  MeLoginRestrictionsApi,
  DomainsApi,
  ClientsApi,
  ScopesApi,
  DelegationIndexApi,
  DelegationsApi,
  DelegationAdminApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => new Api(configuration),
  inject: [ApiConfiguration.provide],
}))
