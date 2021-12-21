import { UserProfileApi, Configuration } from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const exportedApis = [UserProfileApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => new Api(configuration),
  inject: [ApiConfiguration.provide],
}))
