import { ApiConfiguration } from './apiConfiguration'
import {
  CaseApi,
  ClientsApi,
  Configuration,
  DocumentApi,
  MemoApi,
  SecurityApi,
} from '../gen/fetch/dev'

export const exportedApis = [
  DocumentApi,
  CaseApi,
  SecurityApi,
  MemoApi,
  ClientsApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
