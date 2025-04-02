import { Module } from '@nestjs/common'
import { OrganizationPermissionsController } from './organizationPermissions.controller'
import { OrganizationPermissionsService } from './organizationPermissions.service'
import { OrganizationPermission } from './models/organizationPermission.model'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [SequelizeModule.forFeature([OrganizationPermission])],
  controllers: [OrganizationPermissionsController],
  providers: [OrganizationPermissionsService],
})
export class OrganizationPermissionsModule {}
