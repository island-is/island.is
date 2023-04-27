import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  ApiScope,
  ApiScopeGroup,
  IdentityResource,
  Language,
  ResourceTranslationService,
  Translation,
  TranslationService,
} from '@island.is/auth-api-lib'

import { ScopeService } from './scope.service'
import { ScopesController } from './scopes.controller'

@Module({
  imports: [
    SequelizeModule.forFeature([
      IdentityResource,
      ApiScope,
      ApiScopeGroup,
      Translation,
      Language,
    ]),
  ],
  controllers: [ScopesController],
  providers: [ScopeService, ResourceTranslationService, TranslationService],
})
export class ScopesModule {}
