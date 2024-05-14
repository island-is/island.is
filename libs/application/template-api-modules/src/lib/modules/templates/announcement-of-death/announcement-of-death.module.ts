import { DynamicModule } from '@nestjs/common'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { AnnouncementOfDeathService } from './announcement-of-death.service'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SmsModule } from '@island.is/nova-sms'
import {
  NationalRegistryClientConfig,
  NationalRegistryClientModule,
} from '@island.is/clients/national-registry-v2'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import { EmailModule } from '@island.is/email-service'

export class AnnouncementOfDeathModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: AnnouncementOfDeathModule,
      imports: [
        NationalRegistryClientModule,
        SyslumennClientModule,
        SharedTemplateAPIModule.register(config),
        EmailModule.register({
          ...config.emailOptions,
          useNodemailerApp: process.env.USE_NODEMAILER_APP === 'true' ?? false,
          useTestAccount: true,
        }),
        SmsModule.register(config.smsOptions),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [XRoadConfig, NationalRegistryClientConfig],
        }),
      ],
      providers: [AnnouncementOfDeathService],
      exports: [AnnouncementOfDeathService],
    }
  }
}
