import { ApiConfiguration } from './apiConfiguration'
import {
  Configuration,
  UserProfileApi,
  V2MeApi,
  V2UsersApi,
  V2UserTokensApi,
} from '../../gen/fetch'

export const exportedApis = [
  UserProfileApi,
  V2MeApi,
  V2UsersApi,
  V2UserTokensApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
