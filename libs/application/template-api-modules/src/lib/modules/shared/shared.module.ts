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
import { SmsModule } from '@island.is/nova-sms'
import { PaymentModule } from '@island.is/application/api/payment'
import { AttachmentS3Service } from './services'
import { S3Service } from './services/s3.service'
import { S3Client } from '@aws-sdk/client-s3'

export class SharedTemplateAPIModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    const configuration = () => config

    return {
      module: SharedTemplateAPIModule,
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        EmailModule,
        SmsModule,
        ApplicationApiCoreModule,
        AwsModule,
        PaymentModule,
      ],
      providers: [
        SharedTemplateApiService,
        {
          provide: BaseTemplateApiApplicationService,
          useClass: config.applicationService,
        },
        {
          provide: S3Client,
          useValue: new S3Client(),
        },
        S3Service,
        AttachmentS3Service,
      ],
      exports: [SharedTemplateApiService, S3Service, AttachmentS3Service],
    }
  }
}
