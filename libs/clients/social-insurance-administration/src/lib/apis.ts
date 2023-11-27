import {
  Configuration,
  GetApplicantInfoApi,
  GetCurrenciesApi,
  GetIsApplicantEligibleApi,
  SendApplicationApi,
} from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const exportedApis = [
  GetApplicantInfoApi,
  SendApplicationApi,
  GetIsApplicantEligibleApi,
  GetCurrenciesApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
