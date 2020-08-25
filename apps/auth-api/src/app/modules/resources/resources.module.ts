import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { IdentityResource } from './identity-resource.model'
import { ResourcesController } from './resources.controller'
import { ResourcesService } from './resources.service'
import { IdentityResourceUserClaim } from './identity-resource-user-claim.model'
import { ApiScope } from './api-scope.model'
import { ApiScopeUserClaim } from './api-scope-user-claim.model'

@Module({
  imports: [SequelizeModule.forFeature([IdentityResourceUserClaim, IdentityResource, ApiScope, ApiScopeUserClaim])],
  controllers: [ResourcesController],
  providers: [ResourcesService],
})
export class ResourcesModule {}
