import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Language } from './models/language.model'
import { Translation } from './models/translation.model'
import { TranslationService } from './translation.service'

@Module({
  imports: [SequelizeModule.forFeature([Language, Translation])],
  providers: [TranslationService],
  exports: [TranslationService],
})
export class TranslationModule {}
