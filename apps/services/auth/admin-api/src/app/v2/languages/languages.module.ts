import { Module } from '@nestjs/common'

import { TranslationModule } from '@island.is/auth-api-lib'

import { MeLanguagesController } from './me-languages.controller'

@Module({
  imports: [TranslationModule],
  controllers: [MeLanguagesController],
})
export class LanguagesV2Module {}
