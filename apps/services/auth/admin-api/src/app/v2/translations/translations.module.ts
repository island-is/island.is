import { Module } from '@nestjs/common'

import { TranslationModule } from '@island.is/auth-api-lib'

import { MeTranslationsController } from './me-translations.controller'

@Module({
  imports: [TranslationModule],
  controllers: [MeTranslationsController],
})
export class TranslationsV2Module {}
