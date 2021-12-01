import {
  Configuration,
  EinstaklingarApi,
  FasteignirApi,
  LyklarApi,
} from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const exportedApis = [EinstaklingarApi, FasteignirApi, LyklarApi].map(
  (Api) => ({
    provide: Api,
    useFactory: (configuration: Configuration) => {
      return new Api(configuration)
    },
    inject: [ApiConfiguration.provide],
  }),
)
