import {
  Configuration,
  AuthenticateApi,
  CreateCaseApi,
  CreateCustodyCaseApi,
  CreateDocumentApi,
  CreateEmailApi,
  CreateThingbokApi,
  GetCaseSubtypesApi,
  LookupDataGDNJCasesApi,
  ParticipantsApi,
  SearchBankruptcyHistoryApi,
} from '../../gen/fetch'
import { ApiConfig } from './api.config'

export const exportedApis = [
  AuthenticateApi,
  CreateCaseApi,
  CreateCustodyCaseApi,
  CreateDocumentApi,
  CreateEmailApi,
  CreateThingbokApi,
  GetCaseSubtypesApi,
  LookupDataGDNJCasesApi,
  ParticipantsApi,
  SearchBankruptcyHistoryApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfig.provide],
}))
