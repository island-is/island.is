import { Configuration, DefaultApi } from '../../gen/fetch'
import { ApiConfig } from './apiConfig'

export const ApiProvider = {
  provide: DefaultApi,
  useFactory: (config: Configuration) => {
    return new DefaultApi(config)
  },
  inject: [ApiConfig.provide],
}
