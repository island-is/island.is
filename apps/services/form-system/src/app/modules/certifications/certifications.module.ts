import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { CertificationType } from './models/certificationType.model'
import { OrganizationCertificationType } from './models/organizationCertificationType.model'
import { CertificationsController } from './certifications.controller';
import { CertificationsService } from './certifications.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      CertificationType,
      OrganizationCertificationType,
    ]),
  ],
  controllers: [CertificationsController],
  providers: [CertificationsService],
})
export class CertificationsModule {}
