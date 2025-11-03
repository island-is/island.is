import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { RegistrationOfNewPropertyNumbersService } from './registration-of-new-property-numbers.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
import { AssetsClientModule } from '@island.is/clients/assets'
import { HmsApplicationSystemModule } from '@island.is/clients/hms-application-system'
@Module({
  imports: [
    SharedTemplateAPIModule,
    ApplicationsNotificationsModule,
    AssetsClientModule,
    HmsApplicationSystemModule,
  ],
  providers: [RegistrationOfNewPropertyNumbersService],
  exports: [RegistrationOfNewPropertyNumbersService],
})
export class RegistrationOfNewPropertyNumbersModule {}
