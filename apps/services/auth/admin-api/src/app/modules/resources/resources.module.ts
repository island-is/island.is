import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ResourcesController } from './resources.controller'
import {
  ApiResourceSecret,
  IdentityResource,
  ResourcesService,
  ApiScopeUserClaim,
  ApiResourceUserClaim,
  ApiResource,
  ApiResourceScope,
  ApiScope,
  IdentityResourceUserClaim,
  AccessService,
  ApiScopeUserAccess,
  ApiScopeUser,
  ApiScopeGroup,
  Domain,
  DelegationScope,
  Delegation,
  TranslationModule,
} from '@island.is/auth-api-lib'

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
      DelegationScope,
      Delegation,
    ]),
    TranslationModule,
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService, AccessService],
})
export class ResourcesModule {}
