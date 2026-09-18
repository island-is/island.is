import { Module } from '@nestjs/common'

import { NationalAgencyForChildrenAndFamiliesClientModule } from '@island.is/clients/national-agency-for-children-and-families'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
import { SharedTemplateAPIModule } from '../../../shared'
import { NationalRegistryV3Module } from '../../../shared/api/national-registry-v3/national-registry-v3.module'
import { ChildProtectionNotificationService } from './child-protection-notification.service'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ApplicationsNotificationsModule,
    NationalAgencyForChildrenAndFamiliesClientModule,
    NationalRegistryV3Module,
  ],
  providers: [ChildProtectionNotificationService],
  exports: [ChildProtectionNotificationService],
})
export class ChildProtectionNotificationModule {}
