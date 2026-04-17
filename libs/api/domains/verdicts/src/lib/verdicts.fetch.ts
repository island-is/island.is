import {
  type EnhancedFetchAPI,
  createEnhancedFetch,
} from '@island.is/clients/middlewares'
import { LazyDuringDevScope } from '@island.is/nest/config'

export const VERDICTS_FETCH = 'VerdictsEnhancedFetch'

export const verdictsFetch = {
  provide: VERDICTS_FETCH,
  scope: LazyDuringDevScope,
  useFactory: (): EnhancedFetchAPI =>
    createEnhancedFetch({
      name: 'api-verdicts',
    }),
}
