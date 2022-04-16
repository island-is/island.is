import { ApiConfiguration } from './apiConfiguration'
import {
  GetCompanyApi,
  SearchCompanyRegistryApi,
  Configuration,
} from './gen/fetch'

export const exportedApis = [GetCompanyApi, SearchCompanyRegistryApi].map(
  (Api) => ({
    provide: Api,
    useFactory: (configuration: Configuration) => {
      return new Api(configuration)
    },
    inject: [ApiConfiguration.provide],
  }),
)
