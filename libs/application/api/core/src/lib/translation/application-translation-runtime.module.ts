import { Global, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { ApplicationTranslation } from './application-translation.model'
import { ApplicationTranslationLog } from './application-translation-log.model'
import { ApplicationTranslationPublish } from './application-translation-publish.model'
import { ApplicationTranslationPublishSnapshot } from './application-translation-publish-snapshot.model'
import { ApplicationTranslationService } from './application-translation.service'
import { ContentfulTranslationModule } from './contentful/contentful-translation.module'

@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([
      ApplicationTranslation,
      ApplicationTranslationLog,
      ApplicationTranslationPublish,
      ApplicationTranslationPublishSnapshot,
    ]),
    ContentfulTranslationModule,
    FeatureFlagModule,
  ],
  providers: [ApplicationTranslationService],
  exports: [ApplicationTranslationService],
})
export class ApplicationTranslationRuntimeModule {}
