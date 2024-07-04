import {
  TrademarksApi,
  PatentSearchApi,
  DesignSearchApi,
  Configuration,
  SPCApi,
} from '../../gen/fetch'
import { ApiConfig } from './api.config'

export const exportedApis = [
  TrademarksApi,
  PatentSearchApi,
  DesignSearchApi,
  SPCApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfig.provide],
}))
