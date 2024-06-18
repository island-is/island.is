import { Configuration, DocumentApi, PersonApi } from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'
export const exportedApis = [DocumentApi, PersonApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
