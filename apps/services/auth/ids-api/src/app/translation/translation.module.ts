import { Module } from '@nestjs/common'
import { TranslationModule as AuthTranslationModule } from '@island.is/auth-api-lib'
import { TranslationController } from './translation.controller'

@Module({
  imports: [AuthTranslationModule],
  controllers: [TranslationController],
  providers: [],
})
export class TranslationModule {}
