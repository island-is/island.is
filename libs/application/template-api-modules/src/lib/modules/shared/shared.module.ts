import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { EmailModule } from '@island.is/email-service'

import {
  BaseTemplateApiApplicationService,
  BaseTemplateAPIModuleConfig,
} from '../../types'

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
        EmailModule.register(config.emailOptions),
      ],
      providers: [
        SharedTemplateApiService,
        {
          provide: BaseTemplateApiApplicationService,
          useClass: config.applicationService,
        },
      ],
      exports: [SharedTemplateApiService],
    }
  }
}
