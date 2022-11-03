import { LazyDuringDevScope } from '@island.is/nest/config'
import { Configuration, SkipApi, StadaSkipsApi } from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

export const apiProviders = [SkipApi, StadaSkipsApi].map((Api) => ({
  provide: Api,
  scope: LazyDuringDevScope,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
