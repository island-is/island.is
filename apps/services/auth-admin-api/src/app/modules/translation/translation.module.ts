import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  AccessService,
  ApiScopeUser,
  ApiScopeUserAccess,
  Language,
  Translation,
  TranslationService,
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
