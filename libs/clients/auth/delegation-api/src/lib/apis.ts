import {
  ClientsApi,
  Configuration,
  DomainsApi,
  MeDelegationConfirmationsApi,
  MeDelegationsApi,
  MeLoginRestrictionsApi,
  ScopesApi,
  DelegationIndexApi,
  DelegationsApi,
} from '../../gen/fetch'
import { ApiConfiguration } from './api-configuration'

export const exportedApis = [
  MeDelegationsApi,
  MeDelegationConfirmationsApi,
  MeLoginRestrictionsApi,
  DomainsApi,
  ClientsApi,
  ScopesApi,
  DelegationIndexApi,
  DelegationsApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => new Api(configuration),
  inject: [ApiConfiguration.provide],
}))
