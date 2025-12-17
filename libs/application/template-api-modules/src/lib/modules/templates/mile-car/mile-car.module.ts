import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'

import { MileCarService } from './mile-car.service'
import { ApplicationsNotificationsModule } from '../../../notification/notifications.module'
@Module({
  imports: [SharedTemplateAPIModule, ApplicationsNotificationsModule],
  providers: [MileCarService],
  exports: [MileCarService],
})
export class MileCarModule {}
