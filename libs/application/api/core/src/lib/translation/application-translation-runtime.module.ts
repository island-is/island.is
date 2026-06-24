import { Global, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { APPLICATION_TRANSLATION_PROVIDER } from '@island.is/cms-translations'

import { ApplicationTranslation } from './application-translation.model'
import { ApplicationTranslationLog } from './application-translation-log.model'
import { ApplicationTranslationPublish } from './application-translation-publish.model'
import { ApplicationTranslationPublishSnapshot } from './application-translation-publish-snapshot.model'
import { ApplicationTranslationService } from './application-translation.service'
import { ApplicationTranslationProviderImpl } from './application-translation.provider'

/**
 * Registers DB-backed `APPLICATION_TRANSLATION_PROVIDER` for CmsTranslationsService.
 * Runtime reads use the workspace only when `Features.applicationTranslationsFromWorkspace`
 * is enabled; otherwise application namespaces still come from Contentful.
 * Must be imported after `SequelizeModule.forRoot` (application-system API).
 */
@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([
      ApplicationTranslation,
      ApplicationTranslationLog,
      ApplicationTranslationPublish,
      ApplicationTranslationPublishSnapshot,
    ]),
  ],
  providers: [
    ApplicationTranslationService,
    {
      provide: APPLICATION_TRANSLATION_PROVIDER,
      useClass: ApplicationTranslationProviderImpl,
    },
  ],
  exports: [ApplicationTranslationService, APPLICATION_TRANSLATION_PROVIDER],
})
export class ApplicationTranslationRuntimeModule {}
