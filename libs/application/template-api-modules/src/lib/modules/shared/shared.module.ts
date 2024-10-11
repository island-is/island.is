import { Module } from '@nestjs/common'
import { EmailModule } from '@island.is/email-service'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { AwsModule } from '@island.is/nest/aws'
import { SharedTemplateApiService } from './shared.service'
import { SmsModule } from '@island.is/nova-sms'
import { PaymentModule } from '@island.is/application/api/payment'
import { AttachmentS3Service } from './services'
import { ApplicationModule } from './api/application/application.module'

@Module({
  imports: [
    EmailModule,
    SmsModule,
    ApplicationApiCoreModule,
    AwsModule,
    PaymentModule,
    ApplicationModule,
  ],
  providers: [SharedTemplateApiService, AttachmentS3Service],
  exports: [SharedTemplateApiService, AttachmentS3Service],
})
export class SharedTemplateAPIModule {}
