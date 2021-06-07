import { DynamicModule, Module } from '@nestjs/common'
import { BullModule as NestBullModule } from '@nestjs/bull'
import { SequelizeModule } from '@nestjs/sequelize'
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

let BullModule: DynamicModule

if (process.env.INIT_SCHEMA === 'true') {
  BullModule = NestBullModule.registerQueueAsync()
} else {
  const bullModuleName = 'application_system_api_payment_bull_module'
  BullModule = NestBullModule.registerQueueAsync({
    name: 'upload',
    useFactory: () => ({
      prefix: `{${bullModuleName}}`,
      createClient: () =>
        createRedisCluster({
          name: bullModuleName,
          ssl: environment.production,
          nodes: environment.redis.urls,
          noPrefix: true,
        }),
    }),
  })
}

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    TemplateAPIModule.register(environment.templateApi),
    SequelizeModule.forFeature([Payment]),
    BullModule,
    SigningModule.register(environment.signingOptions),
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