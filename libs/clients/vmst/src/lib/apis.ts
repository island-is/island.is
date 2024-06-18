import {
  ParentalLeaveApi,
  PensionApi,
  PregnancyApi,
  UnionApi,
  ApplicationInformationApi,
  Configuration,
} from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const exportedApis = [
  ParentalLeaveApi,
  PensionApi,
  PregnancyApi,
  UnionApi,
  ApplicationInformationApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
