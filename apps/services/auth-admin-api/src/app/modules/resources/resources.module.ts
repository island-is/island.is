import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  AccessService,
  ApiResource,
  ApiResourceScope,
  ApiResourceSecret,
  ApiResourceUserClaim,
  ApiScope,
  ApiScopeGroup,
  ApiScopeUser,
  ApiScopeUserAccess,
  ApiScopeUserClaim,
  Delegation,
  DelegationScope,
  Domain,
  IdentityResource,
  IdentityResourceUserClaim,
  ResourcesService,
} from '@island.is/auth-api-lib'

import { ResourcesController } from './resources.controller'

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
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService, AccessService],
})
export class ResourcesModule {}
