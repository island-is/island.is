import { Module } from '@nestjs/common'

import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
import { SharedTemplateAPIModule } from '../../../shared'
import { ChildProtectionNotificationService } from './child-protection-notification.service'

@Module({
  imports: [SharedTemplateAPIModule, ApplicationsNotificationsModule],
  providers: [ChildProtectionNotificationService],
  exports: [ChildProtectionNotificationService],
})
export class ChildProtectionNotificationModule {}
