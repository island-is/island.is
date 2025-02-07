import { Configuration, EinstaklingarApi } from '../../gen/fetch'
import { ApiConfig } from './apiConfig'

export const exportedApis = [EinstaklingarApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfig.provide],
}))
