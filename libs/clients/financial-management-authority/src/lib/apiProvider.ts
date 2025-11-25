import { Configuration, VacancyApi } from '../../gen/fetch'
import { ApiConfig } from './apiConfig'

export const ApiProvider = {
  provide: VacancyApi,
  useFactory: (config: Configuration) => {
    return new VacancyApi(config)
  },
  inject: [ApiConfig.provide],
}
