import { DynamicModule, Module } from '@nestjs/common'
import { BullModule as NestBullModule } from '@nestjs/bull'
import { FileStorageModule } from '@island.is/file-storage'
import { createRedisCluster } from '@island.is/cache'
import { TemplateAPIModule } from '@island.is/application/template-api-modules'
import { AuthModule } from '@island.is/auth-nest-tools'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { SigningModule } from '@island.is/dokobit-signing'
import { AuditModule } from '@island.is/nest/audit'

import { ApplicationController } from './application.controller'

import { FileService } from './files/file.service'
import { UploadProcessor } from './upload.processor'
import { environment } from '../../../environments'
import {
  APPLICATION_CONFIG,
  ApplicationConfig,
} from './application.configuration'
import { ApplicationAccessService } from './tools/applicationAccess.service'
import { PaymentModule } from '../payment/payment.module'
import { LoggingModule } from '@island.is/logging'
import { TemplateApiApplicationService } from './template-api.service'
import { AwsModule } from '@island.is/nest/aws'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { ApplicationValidationService } from './tools/applicationTemplateValidation.service'
import { TemplateApiActionRunner } from './tools/templateApiActionRunner.service'

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
    TemplateAPIModule.register({
      ...environment.templateApi,
      applicationService: TemplateApiApplicationService,
    }),
    ApplicationApiCoreModule,
    AwsModule,
    FileStorageModule.register(environment.fileStorage),
    BullModule,
    SigningModule,
    CmsTranslationsModule,
    FeatureFlagModule,
    LoggingModule,
  ],
  controllers: [ApplicationController],
  providers: [
    FileService,
    UploadProcessor,
    {
      provide: APPLICATION_CONFIG,
      useValue: environment.application as ApplicationConfig,
    },
    ApplicationAccessService,
    ApplicationValidationService,
    TemplateApiActionRunner,
  ],
})
export class ApplicationModule {}
