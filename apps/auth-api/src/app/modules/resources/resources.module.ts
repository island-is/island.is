import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { IdentityResource } from './identity-resource.model'
import { ResourcesController } from './resources.controller'
import { ResourcesService } from './resources.service'
import { IdentityResourceUserClaim } from './identity-resource-user-claim.model'
import { ApiScope } from './api-scope.model'
import { ApiScopeUserClaim } from './api-scope-user-claim.model'
import { ApiResourceUserClaim } from './api-resource-user-claim.model'
import { ApiResource } from './api-resource.model'
import { ApiResourceScope } from './api-resource-scope.model'

@Module({
  imports: [SequelizeModule.forFeature([
    IdentityResource, IdentityResourceUserClaim,
    ApiScope, ApiScopeUserClaim,
    ApiResource, ApiResourceUserClaim, ApiResourceScope
  ])],
  controllers: [ResourcesController],
  providers: [ResourcesService],
})
export class ResourcesModule {}
