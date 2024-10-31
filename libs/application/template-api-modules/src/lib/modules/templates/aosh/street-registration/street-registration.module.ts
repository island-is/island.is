import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { StreetRegistrationTemplateService } from './street-registration.service'
import { ConfigModule } from '@nestjs/config'
import {
  WorkMachinesClientConfig,
  WorkMachinesClientModule,
} from '@island.is/clients/work-machines'
import {
  ChargeFjsV2ClientConfig,
  ChargeFjsV2ClientModule,
} from '@island.is/clients/charge-fjs-v2'

@Module({
  imports: [
    SharedTemplateAPIModule,
    WorkMachinesClientModule,
    ChargeFjsV2ClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [WorkMachinesClientConfig, ChargeFjsV2ClientConfig],
    }),
  ],
  providers: [StreetRegistrationTemplateService],
  exports: [StreetRegistrationTemplateService],
})
export class StreetRegistrationTemplateModule {}
