import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { IssuanceOfCertificateService } from './issuance-of-certificate.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
@Module({
  imports: [SharedTemplateAPIModule, ApplicationsNotificationsModule],
  providers: [IssuanceOfCertificateService],
  exports: [IssuanceOfCertificateService],
})
export class IssuanceOfCertificateModule {}
