import { Configuration, DigitalIcelandApi } from '../../gen/fetch'
import { SharedApiConfig } from './sharedApiConfig'

export const exportedApis = [DigitalIcelandApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [SharedApiConfig.provide],
}))
