import {
  Configuration,
  EinstaklingarApi,
  GerviEinstaklingarApi,
} from '../../gen/fetch'
import { ApiConfig } from './apiConfig'

export const exportedApis = [EinstaklingarApi, GerviEinstaklingarApi].map(
  (Api) => ({
    provide: Api,
    useFactory: (configuration: Configuration) => {
      return new Api(configuration)
    },
    inject: [ApiConfig.provide],
  }),
)
