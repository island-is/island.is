import { Module } from '@nestjs/common'
import {
  ApplicationApiCoreModule,
  ContentfulTranslationModule,
} from '@island.is/application/api/core'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import {
  CmsTranslationCacheModule,
  CmsTranslationCacheService,
} from '@island.is/cms-translations'
import { TranslationController } from './translation.controller'
import { ApplicationTranslationService } from './application-translation.service'

@Module({
  imports: [
    ApplicationApiCoreModule,
    ContentfulTranslationModule,
    FeatureFlagModule,
    CmsTranslationCacheModule,
  ],
  providers: [CmsTranslationCacheService, ApplicationTranslationService],
  controllers: [TranslationController],
})
export class TranslationModule {}
