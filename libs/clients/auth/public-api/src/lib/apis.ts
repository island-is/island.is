import { ActorDelegationsApi, Configuration } from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const exportedApis = [ActorDelegationsApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => new Api(configuration),
  inject: [ApiConfiguration.provide],
}))
