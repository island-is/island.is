import { Module } from '@nestjs/common'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { AwsModule } from '@island.is/nest/aws'
import { LoggingModule } from '@island.is/logging'
import { ApplicationLifeCycleService } from './application-lifecycle.service'
import {
  ChargeFjsV2ClientConfig,
  ChargeFjsV2ClientModule,
} from '@island.is/clients/charge-fjs-v2'
import { ConfigModule } from '@nestjs/config'
import { XRoadConfig } from '@island.is/nest/config'
import { PaymentModule } from '../../payment/payment.module'
import { environment } from '../../../../environments'

@Module({
  imports: [
    ApplicationApiCoreModule,
    AwsModule,
    LoggingModule,
    ChargeFjsV2ClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [XRoadConfig, ChargeFjsV2ClientConfig],
    }),
    PaymentModule.register({
      clientConfig: environment.templateApi.paymentOptions,
    }),
  ],
  providers: [ApplicationLifeCycleService],
})
export class ApplicationLifecycleModule {}
