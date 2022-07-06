import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EmailModule } from '@island.is/email-service'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { AwsModule } from '@island.is/nest/aws'
import {
  BaseTemplateAPIModuleConfig,
  BaseTemplateApiApplicationService,
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
        ApplicationApiCoreModule,
        AwsModule,
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
