import { DynamicModule, Module } from '@nestjs/common'
import { BullModule as NestBullModule } from '@nestjs/bull'
import { SequelizeModule } from '@nestjs/sequelize'
import { FileStorageModule } from '@island.is/file-storage'
import { createRedisCluster } from '@island.is/cache'
import { TemplateAPIModule } from '@island.is/application/template-api-modules'
import { AuthModule } from '@island.is/auth-nest-tools'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { SigningModule } from '@island.is/dokobit-signing'
import { AuditModule } from '@island.is/nest/audit'

import { Application } from './application.model'
import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'
import { FileService } from './files/file.service'
import { AwsService } from './files/aws.service'
import { UploadProcessor } from './upload.processor'
import { environment } from '../../../environments'
import {
  APPLICATION_CONFIG,
  ApplicationConfig,
} from './application.configuration'
import { ApplicationAccessService } from './tools/applicationAccess.service'
import { PaymentModule } from '../payment/payment.module'

let BullModule: DynamicModule

if (process.env.INIT_SCHEMA === 'true') {
  BullModule = NestBullModule.registerQueueAsync()
} else {
  const bullModuleName = 'application_system_api_bull_module'
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
    PaymentModule.register({
      clientConfig: environment.templateApi.paymentOptions,
    }),
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    TemplateAPIModule.register(environment.templateApi),
    SequelizeModule.forFeature([Application]),
    FileStorageModule.register(environment.fileStorage),
    BullModule,
    SigningModule.register(environment.signingOptions),
    CmsTranslationsModule,
  ],
  controllers: [ApplicationController],
  providers: [
    ApplicationService,
    FileService,
    UploadProcessor,
    {
      provide: APPLICATION_CONFIG,
      useValue: environment.application as ApplicationConfig,
    },
    AwsService,
    ApplicationAccessService,
  ],
})
export class ApplicationModule {}
