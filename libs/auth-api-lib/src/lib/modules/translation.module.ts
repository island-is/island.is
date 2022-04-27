import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Language } from '../entities/models/language.model'
import { Translation } from '../entities/models/translation.model'
import { TranslationService } from '../services/translation.service'

@Module({
  imports: [SequelizeModule.forFeature([Language, Translation])],
  providers: [TranslationService],
  exports: [TranslationService],
})
export class TranslationModule {}
