import {
  Configuration,
  KosningApi,
  MedmaelalistarApi,
  MedmaelasofnunApi,
  MedmaeliApi,
} from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const exportedApis = [
  KosningApi,
  MedmaelalistarApi,
  MedmaelasofnunApi,
  MedmaeliApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
