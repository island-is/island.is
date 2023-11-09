import {
  TherapyApi,
  Configuration,
  AidsandnutritionApi,
  DentistApi,
  HealthcenterApi,
  EhicApi,
  DrugApi,
  OverviewApi,
  PaymentApi,
} from '../../gen/fetch'
import { SharedApiConfig } from './sharedApiConfig'

export const exportedApis = [
  TherapyApi,
  AidsandnutritionApi,
  DentistApi,
  HealthcenterApi,
  EhicApi,
  DrugApi,
  OverviewApi,
  PaymentApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [SharedApiConfig.provide],
}))
