import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EmailService, EMAIL_OPTIONS } from '@island.is/email-service'

import { BaseTemplateAPIModuleConfig } from '../../types'
import { SharedTemplateApiService } from './shared.service'

export class SharedTemplateAPIModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    const configuration = () => config

    return {
      module: SharedTemplateAPIModule,
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],
      providers: [
        {
          provide: EMAIL_OPTIONS,
          useValue: config.emailOptions,
        },
        EmailService,
        SharedTemplateApiService,
      ],
      exports: [SharedTemplateApiService],
    }
  }
}
