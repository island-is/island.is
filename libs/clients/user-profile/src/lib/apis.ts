import { ApiConfiguration } from './apiConfiguration'
import {
  Configuration,
  UserProfileApi,
  V2UsersApi,
  V2MeApi,
  V2MeEmailsApi,
  V2ActorApi,
} from '../../gen/fetch'

export const exportedApis = [
  UserProfileApi,
  V2UsersApi,
  V2MeApi,
  V2MeEmailsApi,
  V2ActorApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
