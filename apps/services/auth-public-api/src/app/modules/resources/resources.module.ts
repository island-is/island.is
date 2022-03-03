import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  ApiResource,
  ApiResourceScope,
  ApiResourceSecret,
  ApiResourceUserClaim,
  ApiScope,
  ApiScopeGroup,
  ApiScopeUser,
  ApiScopeUserAccess,
  ApiScopeUserClaim,
  Domain,
  IdentityResource,
  IdentityResourceUserClaim,
  ResourcesService,
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
  ],
  controllers: [ScopesController],
  providers: [ResourcesService],
})
export class ResourcesModule {}
