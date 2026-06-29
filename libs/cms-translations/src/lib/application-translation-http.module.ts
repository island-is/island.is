import { DynamicModule, Global, Module } from '@nestjs/common'

import { APPLICATION_TRANSLATION_PROVIDER } from './cms-translations.service'
import {
  APPLICATION_TRANSLATION_HTTP_CONFIG,
  ApplicationTranslationHttpConfig,
  ApplicationTranslationHttpProvider,
} from './application-translation-http.provider'
import { applicationTranslationHttpFetch } from './application-translation-http.fetch'

/**
 * HTTP-backed APPLICATION_TRANSLATION_PROVIDER for APIs without the application DB (e.g. island.is api).
 * Expects application-system API to expose GET /public/translations/:namespace.
 */
@Global()
@Module({})
export class ApplicationTranslationHttpModule {
  static register(config: ApplicationTranslationHttpConfig): DynamicModule {
    return {
      module: ApplicationTranslationHttpModule,
      providers: [
        { provide: APPLICATION_TRANSLATION_HTTP_CONFIG, useValue: config },
        applicationTranslationHttpFetch,
        {
          provide: APPLICATION_TRANSLATION_PROVIDER,
          useClass: ApplicationTranslationHttpProvider,
        },
      ],
      exports: [APPLICATION_TRANSLATION_PROVIDER],
    }
  }
}
