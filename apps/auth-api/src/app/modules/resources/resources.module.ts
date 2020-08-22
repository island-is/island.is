import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { IdentityResource } from './identity-resource.model'
import { ResourcesController } from './resources.controller'
import { ResourcesService } from './resources.service'
import { IdentityResourceUserClaim } from './identity-resource-user-claim.model'

@Module({
  imports: [SequelizeModule.forFeature([IdentityResourceUserClaim, IdentityResource])],
  controllers: [ResourcesController],
  providers: [ResourcesService],
})
export class ResourcesModule {}
