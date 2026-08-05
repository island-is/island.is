import { AuthApi, Configuration, RulingsApi } from '../../gen/fetch'
import {
  AuthApiConfiguration,
  RulingsApiConfiguration,
} from './api-configuration'

export const exportedApis = [
  {
    provide: AuthApi,
    useFactory: (configuration: Configuration) => new AuthApi(configuration),
    inject: [AuthApiConfiguration.provide],
  },
  {
    provide: RulingsApi,
    useFactory: (configuration: Configuration) => new RulingsApi(configuration),
    inject: [RulingsApiConfiguration.provide],
  },
]
