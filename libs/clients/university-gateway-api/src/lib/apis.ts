import {
  ApplicationApi,
  Configuration,
  ProgramApi,
  UniversityApi,
} from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const exportedApis = [ApplicationApi, ProgramApi, UniversityApi].map(
  (Api) => ({
    provide: Api,
    useFactory: (configuration: Configuration) => new Api(configuration),
    inject: [ApiConfiguration.provide],
  }),
)
