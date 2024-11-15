import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { WorkAccidentNotificationTemplateService } from './work-accident-notification.service'
import {
  WorkAccidentClientConfig,
  WorkAccidentClientModule,
} from '@island.is/clients/work-accident-ver'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    SharedTemplateAPIModule,
    WorkAccidentClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [WorkAccidentClientConfig],
    }),
  ],
  providers: [WorkAccidentNotificationTemplateService],
  exports: [WorkAccidentNotificationTemplateService],
})
export class WorkAccidentNotificationTemplateModule {}
