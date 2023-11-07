import {
  TrademarksApi,
  PatentSearchApi,
  DesignSearchApi,
  Configuration,
} from '../../gen/fetch'
import { ApiConfig } from './api.config'

export const exportedApis = [
  TrademarksApi,
  PatentSearchApi,
  DesignSearchApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfig.provide],
}))
