import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { CoursesService } from './courses.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
@Module({
  imports: [SharedTemplateAPIModule, ApplicationsNotificationsModule],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
