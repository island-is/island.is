import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { EditUnemploymentInformationService } from './edit-unemployment-information.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
import { VmstUnemploymentClientModule } from '@island.is/clients/vmst-unemployment'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ApplicationsNotificationsModule,
    VmstUnemploymentClientModule,
  ],
  providers: [EditUnemploymentInformationService],
  exports: [EditUnemploymentInformationService],
})
export class EditUnemploymentInformationModule {}
