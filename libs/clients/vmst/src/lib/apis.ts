import {
  ApplicationInformationApi,
  Configuration,
  ParentalLeaveApi,
  PensionApi,
  PregnancyApi,
  UnionApi,
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
  useFactory: (configuration: Configuration) => new Api(configuration),
  inject: [ApiConfiguration.provide],
}))
