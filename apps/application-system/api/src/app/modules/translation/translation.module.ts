import { Module } from '@nestjs/common'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { CmsTranslationCacheModule } from '@island.is/cms-translations'
import { ApplicationTranslationCacheService } from '@island.is/islandis-translations'
import { TranslationController } from './translation.controller'
import { PublicTranslationController } from './public-translation.controller'

@Module({
  imports: [ApplicationApiCoreModule, CmsTranslationCacheModule],
  providers: [ApplicationTranslationCacheService],
  controllers: [TranslationController, PublicTranslationController],
})
export class TranslationModule {}
