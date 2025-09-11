import {
  Configuration,
  ExcelApi,
  PdfApi,
  PublicVehicleSearchApi,
  VehicleSearchApi,
} from '../../gen/fetch'
import { ApiConfig, PublicApiConfig } from './api.config'

export const apiProviders = [VehicleSearchApi, ExcelApi, PdfApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfig.provide],
}))

export const publicApiProviders = [PublicVehicleSearchApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [PublicApiConfig.provide],
}))
