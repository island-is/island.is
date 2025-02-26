import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { ConfigModule } from '@nestjs/config'
import {
  WorkMachinesClientConfig,
  WorkMachinesClientModule,
} from '@island.is/clients/work-machines'
import {
  ChargeFjsV2ClientConfig,
  ChargeFjsV2ClientModule,
} from '@island.is/clients/charge-fjs-v2'
import { TrainingLicenseOnAWorkMachineTemplateService } from './training-license-on-a-work-machine.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'

@Module({
  imports: [
    SharedTemplateAPIModule,
    WorkMachinesClientModule,
    ChargeFjsV2ClientModule,
    ApplicationsNotificationsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [WorkMachinesClientConfig, ChargeFjsV2ClientConfig],
    }),
  ],
  providers: [TrainingLicenseOnAWorkMachineTemplateService],
  exports: [TrainingLicenseOnAWorkMachineTemplateService],
})
export class TrainingLicenseOnAWorkMachineTemplateModule {}
