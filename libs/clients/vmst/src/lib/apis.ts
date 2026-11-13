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
import { VmstApplicationApi } from './applicationApi'

const generatedApis = [ParentalLeaveApi, PensionApi, PregnancyApi, UnionApi]

export const exportedApis = [
  ...generatedApis.map((Api) => ({
    provide: Api,
    useFactory: (configuration: Configuration) => new Api(configuration),
    inject: [ApiConfiguration.provide],
  })),
  // Reads an application in the shape VMST returns (see `applicationApi.ts`)
  {
    provide: ApplicationApi,
    useFactory: (configuration: Configuration) =>
      new VmstApplicationApi(configuration),
    inject: [ApiConfiguration.provide],
  },
  {
    provide: ApplicationInformationApi,
    useFactory: (configuration: Configuration) =>
      new ApplicationInformationApi(configuration),
    inject: [ApiConfiguration.provide],
  },
]
