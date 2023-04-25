import {
  Configuration,
  EinstaklingarApi,
  GerviEinstaklingarApi,
} from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const Apis = [EinstaklingarApi, GerviEinstaklingarApi].map((api) => ({
  provide: api,
  useFactory: (config: Configuration) => {
    return new api(config)
  },
  inject: [ApiConfiguration.provide],
}))
