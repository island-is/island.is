import { Module } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../../shared'

// Here you import your module service
import { ExampleCommonActionsService } from './example-common-actions.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
@Module({
  imports: [SharedTemplateAPIModule, ApplicationsNotificationsModule],
  providers: [ExampleCommonActionsService],
  exports: [ExampleCommonActionsService],
})
export class ExampleCommonActionsModule {}
