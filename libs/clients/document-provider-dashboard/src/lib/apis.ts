import { Configuration, StatisticsApi } from '../../gen/fetch'
import { ApiConfiguration } from './api-configuration'

export const exportedApis = [StatisticsApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => new Api(configuration),
  inject: [ApiConfiguration.provide],
}))
