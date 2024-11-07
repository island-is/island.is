import { Module } from '@nestjs/common'
import { OrganizationCertificationTypesController } from './organizationCertificationTypes.controller'
import { OrganizationCertificationTypesService } from './organizationCertificationTypes.service'
import { OrganizationCertificationType } from './models/organizationCertificationType.model'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [SequelizeModule.forFeature([OrganizationCertificationType])],
  controllers: [OrganizationCertificationTypesController],
  providers: [OrganizationCertificationTypesService],
})
export class OrganizationCertificationTypesModule {}
