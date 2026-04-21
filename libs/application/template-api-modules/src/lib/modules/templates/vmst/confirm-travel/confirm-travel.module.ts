import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { ConfirmTravelService } from './confirm-travel.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
@Module({
  imports: [SharedTemplateAPIModule, ApplicationsNotificationsModule],
  providers: [ConfirmTravelService],
  exports: [ConfirmTravelService],
})
export class ConfirmTravelModule {}
