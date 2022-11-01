import {
  ActorDelegationsApi,
  Configuration,
  MeDelegationsApi,
  ScopesApi,
} from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const exportedApis = [
  MeDelegationsApi,
  ActorDelegationsApi,
  ScopesApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => new Api(configuration),
  inject: [ApiConfiguration.provide],
}))
