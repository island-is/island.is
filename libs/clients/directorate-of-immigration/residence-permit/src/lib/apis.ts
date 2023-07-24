import {
  ApplicantApi,
  Configuration,
  CriminalRecordApi,
  OptionSetApi,
  ResidenceAbroadApi,
  StudyApi,
  TravelDocumentApi,
} from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const exportedApis = [
  OptionSetApi,
  ApplicantApi,
  ResidenceAbroadApi,
  CriminalRecordApi,
  StudyApi,
  TravelDocumentApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
