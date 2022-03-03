import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  ApiResource,
  ApiResourceScope,
  ApiResourceSecret,
  ApiResourceUserClaim,
  ApiScope,
  ApiScopeGroup,
  ApiScopeUserClaim,
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
      ApiScopeGroup,
      Domain,
    ]),
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService],
})
export class ResourcesModule {}
