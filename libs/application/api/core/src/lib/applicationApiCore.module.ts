import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Application } from './application/application.model'
import { ApplicationService } from './application/application.service'
import { ApplicationTranslation } from './translation/application-translation.model'
import { ApplicationTranslationLog } from './translation/application-translation-log.model'
import { ApplicationTranslationService } from './translation/application-translation.service'
import { ApplicationTranslationProviderImpl } from './translation/application-translation.provider'
import { TemplateIntrospectionService } from './translation/template-introspection.service'
import { AiTranslateService } from './translation/ai-translate.service'
import { APPLICATION_TRANSLATION_PROVIDER } from '@island.is/cms-translations'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Application,
      ApplicationTranslation,
      ApplicationTranslationLog,
    ]),
  ],
  providers: [
    ApplicationService,
    ApplicationTranslationService,
    TemplateIntrospectionService,
    AiTranslateService,
    {
      provide: APPLICATION_TRANSLATION_PROVIDER,
      useClass: ApplicationTranslationProviderImpl,
    },
  ],
  exports: [
    ApplicationService,
    ApplicationTranslationService,
    TemplateIntrospectionService,
    AiTranslateService,
    APPLICATION_TRANSLATION_PROVIDER,
  ],
})
export class ApplicationApiCoreModule {}
