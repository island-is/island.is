import { ApiConfiguration } from './apiConfiguration'
import { Configuration, UserProfileApi, V2MeApi } from '../../gen/fetch'

export const exportedApis = [UserProfileApi, V2MeApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
