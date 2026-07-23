import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { U2CertificateService } from './u2-certificate.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
import { VmstUnemploymentClientModule } from '@island.is/clients/vmst-unemployment'
@Module({
  imports: [
    SharedTemplateAPIModule,
    ApplicationsNotificationsModule,
    VmstUnemploymentClientModule,
  ],
  providers: [U2CertificateService],
  exports: [U2CertificateService],
})
export class U2CertificateModule {}
