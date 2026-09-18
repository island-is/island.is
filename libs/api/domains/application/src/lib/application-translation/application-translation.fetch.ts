import {
  type EnhancedFetchAPI,
  createEnhancedFetch,
} from '@island.is/clients/middlewares'
import { LazyDuringDevScope } from '@island.is/nest/config'

export const APPLICATION_TRANSLATION_FETCH =
  'ApplicationTranslationEnhancedFetch'

export const applicationTranslationFetch = {
  provide: APPLICATION_TRANSLATION_FETCH,
  scope: LazyDuringDevScope,
  useFactory: (): EnhancedFetchAPI =>
    createEnhancedFetch({
      name: 'api-application-translation',
      organizationSlug: 'stafraent-island',
      timeout: 60000,
      logErrorResponseBody: true,
    }),
}
