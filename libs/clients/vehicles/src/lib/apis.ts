import { Configuration, VehiclesApi } from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const exportedApis = [VehiclesApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
