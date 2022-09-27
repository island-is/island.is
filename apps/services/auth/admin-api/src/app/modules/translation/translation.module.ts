import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  Translation,
  Language,
  TranslationService,
  AccessService,
  ApiScopeUserAccess,
  ApiScopeUser,
} from '@island.is/auth-api-lib'
import { TranslationController } from './translation.controller'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Translation,
      Language,
      ApiScopeUserAccess,
      ApiScopeUser,
    ]),
  ],
  controllers: [TranslationController],
  providers: [TranslationService, AccessService],
})
export class TranslationModule {}
