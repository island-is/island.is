import {
  Configuration,
  AuthApi,
  UnemploymentApplicationApi,
} from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const exportedApis = [AuthApi, UnemploymentApplicationApi].map(
  (Api) => ({
    provide: Api,
    useFactory: (configuration: Configuration) => {
      return new Api(configuration)
    },
    inject: [ApiConfiguration.provide],
  }),
)
