import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { ExampleAuthDelegationService } from './example-auth-delegation.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
@Module({
  imports: [SharedTemplateAPIModule, ApplicationsNotificationsModule],
  providers: [ExampleAuthDelegationService],
  exports: [ExampleAuthDelegationService],
})
export class ExampleAuthDelegationModule {}
