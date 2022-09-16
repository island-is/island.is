import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  AccessService,
  ApiScope,
  IdentityResource,
  IdentityResourceUserClaim,
  ApiScopeUserClaim,
  ApiResource,
  ApiResourceUserClaim,
  ApiResourceScope,
  ApiResourceSecret,
  ApiScopeUser,
  ApiScopeUserAccess,
  ApiScopeGroup,
  Domain,
  TranslationModule,
  ResourcesModule,
} from '@island.is/auth-api-lib'
import { PermissionsController } from './permissions.controller'

@Module({
  imports: [
    ResourcesModule,
    SequelizeModule.forFeature([
      IdentityResource,
      IdentityResourceUserClaim,
      ApiScope,
      ApiScopeUserClaim,
      ApiResource,
      ApiResourceUserClaim,
      ApiResourceScope,
      ApiResourceSecret,
      ApiScopeUser,
      ApiScopeUserAccess,
      ApiScopeGroup,
      Domain,
    ]),
    TranslationModule,
  ],
  controllers: [PermissionsController],
  providers: [AccessService],
})
export class PermissionsModule {}
