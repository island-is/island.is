import { Module } from '@nestjs/common'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { TranslationController } from './translation.controller'

@Module({
  imports: [ApplicationApiCoreModule],
  controllers: [TranslationController],
})
export class TranslationModule {}
