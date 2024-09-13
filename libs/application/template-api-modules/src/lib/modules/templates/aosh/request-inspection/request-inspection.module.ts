import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { RequestInspectionTemplateService } from './request-inspection.service'
import { ConfigModule } from '@nestjs/config'
import {
  WorkMachinesClientConfig,
  WorkMachinesClientModule,
} from '@island.is/clients/work-machines'
import { ChargeFjsV2ClientConfig } from '@island.is/clients/charge-fjs-v2'

@Module({
  imports: [
    SharedTemplateAPIModule,
    WorkMachinesClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [WorkMachinesClientConfig, ChargeFjsV2ClientConfig],
    }),
  ],
  providers: [RequestInspectionTemplateService],
  exports: [RequestInspectionTemplateService],
})
export class RequestInspectionTemplateModule {}
