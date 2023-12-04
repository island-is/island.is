import {
  ApplicationApi,
  Configuration,
  CourseApi,
  ProgramApi,
  UniversityApi,
} from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const exportedApis = [
  ApplicationApi,
  CourseApi,
  ProgramApi,
  UniversityApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => new Api(configuration),
  inject: [ApiConfiguration.provide],
}))
