import { Configuration, AircraftRegistryApi } from '../../gen/fetch'
import { ApiConfig } from './apiConfig'

export const ApiProvider = {
  provide: AircraftRegistryApi,
  useFactory: (config: Configuration) => {
    return new AircraftRegistryApi(config)
  },
  inject: [ApiConfig.provide],
}
