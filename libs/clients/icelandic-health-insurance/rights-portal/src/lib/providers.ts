import {
  TherapiesApi as TherapyApi,
  Configuration,
  AidsandnutritionApi,
  DentistsApi as DentistApi,
  HealthcentersApi as HealthcenterApi,
  EhicApi,
  DrugsApi as DrugApi,
  OverviewInsuranceApi as OverviewApi,
  PaymentsCopaymentApi,
  PaymentsOverviewApi,
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
  PaymentsCopaymentApi,
  PaymentsOverviewApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [SharedApiConfig.provide],
}))
