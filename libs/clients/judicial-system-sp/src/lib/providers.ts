import { CasesApi, Configuration, DefendersApi } from '../../gen/fetch'
import { SharedApiConfig } from './shared.config'

export const exportedApis = [CasesApi, DefendersApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [SharedApiConfig.provide],
}))
