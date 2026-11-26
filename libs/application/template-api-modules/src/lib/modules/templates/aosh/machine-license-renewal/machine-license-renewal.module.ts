import { Module } from '@nestjs/common'
import { SeminarsClientModule } from '@island.is/clients/seminars-ver'
import { SharedTemplateAPIModule } from '../../../shared'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
import { MachineLicenseRenewalService } from './machine-license-renewal.service'

@Module({
  imports: [
    SharedTemplateAPIModule,
    SeminarsClientModule,
    ApplicationsNotificationsModule,
  ],
  providers: [MachineLicenseRenewalService],
  exports: [MachineLicenseRenewalService],
})
export class MachineLicenseRenewalModule {}
