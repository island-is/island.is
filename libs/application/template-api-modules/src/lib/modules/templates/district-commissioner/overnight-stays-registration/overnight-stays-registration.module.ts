import { Module } from '@nestjs/common'
import { DistrictCommissionersHomeLodgingsClientModule } from '@island.is/clients/district-commissioners-home-lodgings'

import { SharedTemplateAPIModule } from '../../../shared'

import { OvernightStaysRegistrationService } from './overnight-stays-registration.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
@Module({
  imports: [
    SharedTemplateAPIModule,
    ApplicationsNotificationsModule,
    DistrictCommissionersHomeLodgingsClientModule,
  ],
  providers: [OvernightStaysRegistrationService],
  exports: [OvernightStaysRegistrationService],
})
export class OvernightStaysRegistrationModule {}
