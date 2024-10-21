import { Module } from '@nestjs/common'
import { OrganizationCertificationsController } from './organizationCertifications.controller'
import { OrganizationCertificationsService } from './organizationCertifications.service'
import { OrganizationCertification } from './models/organizationCertification.model'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [SequelizeModule.forFeature([OrganizationCertification])],
  controllers: [OrganizationCertificationsController],
  providers: [OrganizationCertificationsService],
})
export class OrganizationCertificationsModule {}
