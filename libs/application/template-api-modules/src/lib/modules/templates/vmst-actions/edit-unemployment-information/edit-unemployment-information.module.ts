import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { EditUnemploymentInformationService } from './edit-unemployment-information.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
@Module({
  imports: [SharedTemplateAPIModule, ApplicationsNotificationsModule],
  providers: [EditUnemploymentInformationService],
  exports: [EditUnemploymentInformationService],
})
export class EditUnemploymentInformationModule {}
