import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { SubmitDocumentsService } from './submit-documents.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
import { VmstUnemploymentClientModule } from '@island.is/clients/vmst-unemployment'
import { AwsModule } from '@island.is/nest/aws'
@Module({
  imports: [
    SharedTemplateAPIModule,
    AwsModule,
    ApplicationsNotificationsModule,
    VmstUnemploymentClientModule,
  ],
  providers: [SubmitDocumentsService],
  exports: [SubmitDocumentsService],
})
export class SubmitDocumentsModule {}
