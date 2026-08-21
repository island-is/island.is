import { Global, Module } from '@nestjs/common'

import { APPLICATION_TRANSLATION_PROVIDER } from './application-translation.provider'
import { ApplicationTranslationHttpProvider } from './application-translation-http.provider'
import { applicationTranslationHttpFetch } from './application-translation-http.fetch'

/**
 * HTTP-backed APPLICATION_TRANSLATION_PROVIDER for APIs without the application DB (e.g. island.is api).
 * Expects application-system API to expose GET /public/translations/:namespace.
 */
@Global()
@Module({
  providers: [
    applicationTranslationHttpFetch,
    {
      provide: APPLICATION_TRANSLATION_PROVIDER,
      useClass: ApplicationTranslationHttpProvider,
    },
  ],
  exports: [APPLICATION_TRANSLATION_PROVIDER],
})
export class ApplicationTranslationHttpModule {}
