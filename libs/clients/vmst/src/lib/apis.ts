import {
  ParentalLeaveApi,
  PensionApi,
  PregnancyApi,
  UnionApi,
  ApplicationApi,
  Configuration,
} from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'
import { ApplicationInformationApi } from './applicationInformationApi'

const generatedApis = [
  ParentalLeaveApi,
  PensionApi,
  PregnancyApi,
  UnionApi,
  ApplicationApi,
]

export const exportedApis = [
  ...generatedApis.map((Api) => ({
    provide: Api,
    useFactory: (configuration: Configuration) => new Api(configuration),
    inject: [ApiConfiguration.provide],
  })),
  {
    provide: ApplicationInformationApi,
    useFactory: (configuration: Configuration) =>
      new ApplicationInformationApi(configuration),
    inject: [ApiConfiguration.provide],
  },
]
