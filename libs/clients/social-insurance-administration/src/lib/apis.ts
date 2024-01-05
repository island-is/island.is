import {
  ApplicantApi,
  ApplicationApi,
  GeneralApi,
  Configuration,
} from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const exportedApis = [ApplicantApi, ApplicationApi, GeneralApi].map(
  (Api) => ({
    provide: Api,
    useFactory: (configuration: Configuration) => {
      return new Api(configuration)
    },
    inject: [ApiConfiguration.provide],
  }),
)
