import { DynamicModule, Module } from '@nestjs/common'
import { BullModule as NestBullModule } from '@nestjs/bull'
import { SequelizeModule } from '@nestjs/sequelize'
import { FileStorageModule } from '@island.is/file-storage'
import { createRedisCluster } from '@island.is/cache'
import { TemplateAPIModule } from '@island.is/application/template-api-modules'
import { AuthModule } from '@island.is/auth-nest-tools'
import { TranslationsModule } from '@island.is/api/domains/translations'
import { SigningModule } from '@island.is/dokobit-signing'
import { AuditModule } from '@island.is/nest/audit'

import { Payment } from './payment.model'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'
import { AwsService } from '../application/files/aws.service'
import { environment } from '../../../environments'
import {
  PAYMENT_CONFIG,
  PaymentConfig,
} from './payment.configuration'
import { ApplicationAccessService } from '../application/tools/applicationAccess.service'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forFeature([Payment]),
    TranslationsModule,
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: PAYMENT_CONFIG,
      useValue: environment.application as PaymentConfig,
    },
    AwsService,
    ApplicationAccessService,
  ],
})
export class PaymentModule {}
