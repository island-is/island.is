import { TherapyApi, Configuration, AidsandnutritionApi } from '../../gen/fetch'
import { SharedApiConfig } from './sharedApiConfig'

export const exportedApis = [TherapyApi, AidsandnutritionApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [SharedApiConfig.provide],
}))
