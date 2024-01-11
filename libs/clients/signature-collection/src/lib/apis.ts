import {
  Configuration,
  MedmaelalistarApi,
  MedmaelasofnunApi,
  MedmaeliApi,
  FrambodApi,
} from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const exportedApis = [
  MedmaelalistarApi,
  MedmaelasofnunApi,
  MedmaeliApi,
  FrambodApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
