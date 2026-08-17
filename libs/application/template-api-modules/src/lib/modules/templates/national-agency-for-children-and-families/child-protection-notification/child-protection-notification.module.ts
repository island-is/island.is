import { Module } from '@nestjs/common'

import { DataGatewayClientModule } from '@island.is/clients/mms/data-gateway'
import { FriggClientModule } from '@island.is/clients/mms/frigg'
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
    FriggClientModule,
    NationalRegistryV3Module,
    DataGatewayClientModule,
  ],
  providers: [ChildProtectionNotificationService],
  exports: [ChildProtectionNotificationService],
})
export class ChildProtectionNotificationModule {}
