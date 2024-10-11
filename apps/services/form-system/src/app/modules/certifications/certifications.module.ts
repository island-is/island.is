import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { CertificationType } from './models/certificationType.model'
import { OrganizationCertificationType } from './models/organizationCertificationType.model'

@Module({
  imports: [
    SequelizeModule.forFeature([
      CertificationType,
      OrganizationCertificationType,
    ]),
  ],
})
export class CertificationsModule {}
