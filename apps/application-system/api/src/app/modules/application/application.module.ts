import { BullModule as NestBullModule } from '@nestjs/bull'
import { DynamicModule, Global, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { TemplateAPIModule } from '@island.is/application/template-api-modules'
import { AuthModule } from '@island.is/auth-nest-tools'
import { createRedisCluster } from '@island.is/cache'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { SigningModule } from '@island.is/dokobit-signing'
import { FileStorageModule } from '@island.is/file-storage'
import { LoggingModule } from '@island.is/logging'
import { AuditModule } from '@island.is/nest/audit'

import { environment } from '../../../environments'
import { PaymentModule } from '../payment/payment.module'

import { AwsService } from './files/aws.service'
import { FileService } from './files/file.service'
import { ApplicationLifeCycleService } from './lifecycle/application-lifecycle.service'
import { ApplicationAccessService } from './tools/applicationAccess.service'
import {
  APPLICATION_CONFIG,
  ApplicationConfig,
} from './application.configuration'
import { ApplicationController } from './application.controller'
import { Application } from './application.model'
import { ApplicationService } from './application.service'
import { TemplateApiApplicationService } from './template-api.service'
import { UploadProcessor } from './upload.processor'

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

@Global()
@Module({
  imports: [
    PaymentModule.register({
      clientConfig: environment.templateApi.paymentOptions,
    }),
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    TemplateAPIModule.register({
      ...environment.templateApi,
      applicationService: TemplateApiApplicationService,
    }),
    SequelizeModule.forFeature([Application]),
    FileStorageModule.register(environment.fileStorage),
    BullModule,
    SigningModule.register(environment.signingOptions),
    CmsTranslationsModule,
    LoggingModule,
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
    ApplicationLifeCycleService,
  ],
  exports: [ApplicationService, APPLICATION_CONFIG, AwsService],
})
export class ApplicationModule {}
