import {
  ApplicantApi,
  ApplicantResidenceConditionApi,
  ApplicationApi,
  ApplicationAttachmentApi,
  Configuration,
  CountryOfResidenceApi,
  CriminalRecordApi,
  OptionSetApi,
  ResidenceAbroadApi,
  StaticDataApi,
  StudyApi,
  TravelDocumentApi,
} from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const exportedApis = [
  ApplicantApi,
  ApplicantResidenceConditionApi,
  ApplicationApi,
  ApplicationAttachmentApi,
  CountryOfResidenceApi,
  CriminalRecordApi,
  OptionSetApi,
  ResidenceAbroadApi,
  StaticDataApi,
  StudyApi,
  TravelDocumentApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
