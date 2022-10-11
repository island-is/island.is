import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  IdentityResource,
  IdentityResourceUserClaim,
  ApiScope,
  ApiScopeUserClaim,
  ApiResource,
  ApiResourceUserClaim,
  ApiResourceScope,
  ApiResourceSecret,
  ApiScopeUserAccess,
  ApiScopeUser,
  ApiScopeGroup,
  Domain,
  ResourcesService,
  TranslationModule,
} from '@island.is/auth-api-lib'
import { ScopesController } from './scopes.controller'

@Module({
  imports: [
    SequelizeModule.forFeature([
      IdentityResource,
      IdentityResourceUserClaim,
      ApiScope,
      ApiScopeUserClaim,
      ApiResource,
      ApiResourceUserClaim,
      ApiResourceScope,
      ApiResourceSecret,
      ApiScopeUserAccess,
      ApiScopeUser,
      ApiScopeGroup,
      Domain,
    ]),
    TranslationModule,
  ],
  controllers: [ScopesController],
  providers: [ResourcesService],
})
export class ResourcesModule {}
