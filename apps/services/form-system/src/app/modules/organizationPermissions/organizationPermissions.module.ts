import { Module } from '@nestjs/common'
import { OrganizationPermissionsController } from './organizationPermissions.controller'
import { OrganizationPermissionsService } from './organizationPermissions.service'
import { OrganizationPermission } from './models/organizationPermission.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { Organization } from '../organizations/models/organization.model'

@Module({
  imports: [SequelizeModule.forFeature([OrganizationPermission, Organization])],
  controllers: [OrganizationPermissionsController],
  providers: [OrganizationPermissionsService],
})
export class OrganizationPermissionsModule {}
