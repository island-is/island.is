import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Certification } from './models/certification.model'
import { OrganizationCertification } from './models/organizationCertification.model'
import { CertificationsController } from './certifications.controller'
import { CertificationsService } from './certifications.service'

@Module({
  imports: [
    SequelizeModule.forFeature([Certification, OrganizationCertification]),
  ],
  controllers: [CertificationsController],
  providers: [CertificationsService],
})
export class CertificationsModule {}
