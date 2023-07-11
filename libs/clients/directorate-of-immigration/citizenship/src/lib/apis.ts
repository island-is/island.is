import {
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
  ApplicationApi,
  ChildrenApi,
  SpouseApi,
  ParentApi,
  CountryOfResidenceApi,
  ResidenceAbroadApi,
  TravelDocumentApi,
  ApplicantResidenceConditionApi,
  OptionSetApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
