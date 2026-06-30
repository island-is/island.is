import {
  type EnhancedFetchAPI,
  createEnhancedFetch,
} from '@island.is/clients/middlewares'
import { LazyDuringDevScope } from '@island.is/nest/config'

export const APPLICATION_TRANSLATION_HTTP_FETCH =
  'ApplicationTranslationHttpEnhancedFetch'

export const applicationTranslationHttpFetch = {
  provide: APPLICATION_TRANSLATION_HTTP_FETCH,
  scope: LazyDuringDevScope,
  useFactory: (): EnhancedFetchAPI =>
    createEnhancedFetch({
      name: 'islandis-application-translation-http',
      organizationSlug: 'stafraent-island',
      timeout: 60000,
      logErrorResponseBody: true,
    }),
}
