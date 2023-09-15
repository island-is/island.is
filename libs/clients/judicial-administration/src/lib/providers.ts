import {
  Configuration,
  AuthenticateApi,
  SearchBankruptcyHistoryApi,
} from '../../gen/fetch'
import { ApiConfig } from './api.config'

export const exportedApis = [AuthenticateApi, SearchBankruptcyHistoryApi].map(
  (Api) => ({
    provide: Api,
    useFactory: (configuration: Configuration) => {
      return new Api(configuration)
    },
    inject: [ApiConfig.provide],
  }),
)
