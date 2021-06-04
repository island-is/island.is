import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  TranslationService,
  Translation,
  Language,
} from '@island.is/auth-api-lib'
import { TranslationController } from './translation.controller'

@Module({
  imports: [SequelizeModule.forFeature([Translation, Language])],
  controllers: [TranslationController],
  providers: [TranslationService],
})
export class TranslationModule {}
