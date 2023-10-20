import {
  TherapyApi,
  Configuration,
  AidsandnutritionApi,
  DentistApi,
  HealthcenterApi,
  EhicApi,
} from '../../gen/fetch'
import { SharedApiConfig } from './sharedApiConfig'

export const exportedApis = [
  TherapyApi,
  AidsandnutritionApi,
  DentistApi,
  HealthcenterApi,
  EhicApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [SharedApiConfig.provide],
}))
