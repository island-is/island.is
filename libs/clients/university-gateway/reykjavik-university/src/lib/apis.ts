import { Configuration, DepartmentsApi, MajorsApi } from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const exportedApis = [MajorsApi, DepartmentsApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
