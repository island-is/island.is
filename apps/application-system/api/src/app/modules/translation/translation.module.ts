import { Module } from '@nestjs/common'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import {
  CmsTranslationCacheModule,
  CmsTranslationCacheService,
} from '@island.is/cms-translations'
import { TranslationController } from './translation.controller'

@Module({
  imports: [ApplicationApiCoreModule, CmsTranslationCacheModule],
  providers: [CmsTranslationCacheService],
  controllers: [TranslationController],
})
export class TranslationModule {}
