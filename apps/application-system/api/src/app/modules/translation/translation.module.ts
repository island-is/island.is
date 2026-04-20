import { Module } from '@nestjs/common'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { TranslationController } from './translation.controller'
import { PublicTranslationController } from './public-translation.controller'

@Module({
  imports: [ApplicationApiCoreModule],
  controllers: [TranslationController, PublicTranslationController],
})
export class TranslationModule {}
