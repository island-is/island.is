import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { IdentityResource } from './model/identity-resource.model'
import { ResourcesController } from './resources.controller'
import { ResourcesService } from './resources.service'
import { IdentityResourceUserClaim } from './model/identity-resource-user-claim.model'
import { ApiScope } from './model/api-scope.model'
import { ApiScopeUserClaim } from './model/api-scope-user-claim.model'
import { ApiResourceUserClaim } from './model/api-resource-user-claim.model'
import { ApiResource } from './model/api-resource.model'
import { ApiResourceScope } from './model/api-resource-scope.model'
import { ApiResourceSecret } from './model/api-resource-secret.model'

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
    ]),
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService],
})
export class ResourcesModule {}
