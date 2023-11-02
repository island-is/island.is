import {
  Configuration,
  MachinesApi,
  MachinesDocumentApi,
} from '../../gen/fetch'
import { ApiConfig } from './api.config'

export const apiProviders = [MachinesApi, MachinesDocumentApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfig.provide],
}))
