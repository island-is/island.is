import { TherapyApi, Configuration, AidsandnutritionApi } from '../../gen/fetch'
import { ApiConfig } from './rightsPortalProvider'

export const exportedApis = [TherapyApi, AidsandnutritionApi].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfig.provide],
}))
