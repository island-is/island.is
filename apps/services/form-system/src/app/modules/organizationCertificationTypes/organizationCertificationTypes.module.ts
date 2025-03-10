import { Module } from '@nestjs/common'
import { OrganizationPermissionsController } from './organizationCertificationTypes.controller'
import { OrganizationPermissionsService } from './organizationCertificationTypes.service'
import { OrganizationPermission } from './models/organizationCertificationType.model'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [SequelizeModule.forFeature([OrganizationPermission])],
  controllers: [OrganizationPermissionsController],
  providers: [OrganizationPermissionsService],
})
export class OrganizationCertificationTypesModule {}
