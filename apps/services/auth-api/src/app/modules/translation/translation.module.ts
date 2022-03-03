import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  Language,
  Translation,
  TranslationService,
} from '@island.is/auth-api-lib'

import { TranslationController } from './translation.controller'

@Module({
  imports: [SequelizeModule.forFeature([Translation, Language])],
  controllers: [TranslationController],
  providers: [TranslationService],
})
export class TranslationModule {}
