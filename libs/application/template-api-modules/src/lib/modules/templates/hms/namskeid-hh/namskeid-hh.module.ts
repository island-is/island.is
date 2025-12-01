import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { NamskeidHhService } from './namskeid-hh.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'

@Module({
  imports: [SharedTemplateAPIModule, ApplicationsNotificationsModule],
  providers: [NamskeidHhService],
  exports: [NamskeidHhService],
})
export class NamskeidHhModule {}

