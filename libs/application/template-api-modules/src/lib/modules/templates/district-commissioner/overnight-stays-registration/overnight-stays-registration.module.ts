import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { OvernightStaysRegistrationService } from './overnight-stays-registration.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
@Module({
  imports: [SharedTemplateAPIModule, ApplicationsNotificationsModule],
  providers: [OvernightStaysRegistrationService],
  exports: [OvernightStaysRegistrationService],
})
export class OvernightStaysRegistrationModule {}
