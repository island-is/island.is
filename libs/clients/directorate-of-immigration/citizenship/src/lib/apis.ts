import {
  ApplicantApi,
  ApplicantResidenceConditionApi,
  ApplicationApi,
  ChildrenApi,
  Configuration,
  CountryOfResidenceApi,
  OptionSetApi,
  ParentApi,
  ResidenceAbroadApi,
  SpouseApi,
  TravelDocumentApi,
} from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const exportedApis = [
  ApplicantApi,
  ApplicantResidenceConditionApi,
  ApplicationApi,
  ChildrenApi,
  CountryOfResidenceApi,
  OptionSetApi,
  ParentApi,
  ResidenceAbroadApi,
  SpouseApi,
  TravelDocumentApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
