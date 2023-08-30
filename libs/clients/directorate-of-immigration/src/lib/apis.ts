import {
  ApplicantApi,
  ApplicantResidenceConditionApi,
  ApplicationApi,
  ChildrenApi,
  Configuration,
  CountryOfResidenceApi,
  CriminalRecordApi,
  OptionSetApi,
  ParentApi,
  ResidenceAbroadApi,
  SpouseApi,
  StudyApi,
  TravelDocumentApi,
} from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const exportedApis = [
  ApplicantApi,
  ApplicantResidenceConditionApi,
  ApplicationApi,
  ChildrenApi,
  CountryOfResidenceApi,
  CriminalRecordApi,
  OptionSetApi,
  ParentApi,
  ResidenceAbroadApi,
  SpouseApi,
  StudyApi,
  TravelDocumentApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
