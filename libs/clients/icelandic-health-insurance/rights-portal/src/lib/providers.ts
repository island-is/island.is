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
  InsurancestatementsApi,
  AccidentreportsApi,
} from '../../gen/fetch'
import { SharedApiConfig } from './sharedApiConfig'

export const exportedApis = [
  TherapyApi,
  AidsandnutritionApi,
  DentistApi,
  HealthcenterApi,
  EhicApi,
  InsurancestatementsApi,
  DrugApi,
  OverviewApi,
  PaymentsCopaymentApi,
  PaymentsOverviewApi,
  AccidentreportsApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [SharedApiConfig.provide],
}))
