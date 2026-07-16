import { Module } from '@nestjs/common'

import { FriggClientModule } from '@island.is/clients/mms/frigg'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
import { SharedTemplateAPIModule } from '../../../shared'
import { NationalAgencyForChildrenAndFamiliesClientModule } from '@island.is/clients/national-agency-for-children-and-families'
import { ChildProtectionNotificationService } from './child-protection-notification.service'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ApplicationsNotificationsModule,
    NationalAgencyForChildrenAndFamiliesClientModule,
    FriggClientModule,
  ],
  providers: [ChildProtectionNotificationService],
  exports: [ChildProtectionNotificationService],
})
export class ChildProtectionNotificationModule {}
