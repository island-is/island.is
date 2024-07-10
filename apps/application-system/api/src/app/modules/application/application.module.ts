import { Module } from '@nestjs/common'
import { FileStorageModule } from '@island.is/file-storage'

import { TemplateAPIModule } from '@island.is/application/template-api-modules'
import { AuthModule } from '@island.is/auth-nest-tools'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { SigningModule } from '@island.is/dokobit-signing'
import { AuditModule } from '@island.is/nest/audit'

import { AdminController } from './admin.controller'
import { ApplicationController } from './application.controller'
import { environment } from '../../../environments'

import { ApplicationAccessService } from './tools/applicationAccess.service'

import { LoggingModule } from '@island.is/logging'
import { TemplateApiApplicationService } from './template-api.service'
import { AwsModule } from '@island.is/nest/aws'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { ApplicationValidationService } from './tools/applicationTemplateValidation.service'
import { TemplateApiActionRunner } from './tools/templateApiActionRunner.service'
import { ApplicationChargeModule } from './charge/application-charge.module'
import {
  ApplicationFilesModule,
  createBullModule,
} from '@island.is/application/api/files'
import { PaymentModule } from '@island.is/application/api/payment'
import { HistoryModule } from '@island.is/application/api/history'
import { AuthPublicApiClientModule } from '@island.is/clients/auth/public-api'
import { ApplicationActionService } from './application-action.service'
import { TemplateAPIConfig } from '@island.is/application/template-api-modules'

@Module({
  imports: [
    PaymentModule,
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    TemplateAPIModule.register({
      // TODO: Update typing to accomodate incomplete module setup
      // Some modules don't need to configure everything, yet the type requires it.
      ...(environment.templateApi as TemplateAPIConfig),
      applicationService: TemplateApiApplicationService,
    }),
    ApplicationApiCoreModule,
    createBullModule(),
    ApplicationFilesModule,
    AwsModule,
    FileStorageModule,
    SigningModule,
    CmsTranslationsModule,
    FeatureFlagModule,
    HistoryModule,
    LoggingModule,
    ApplicationChargeModule,
    AuthPublicApiClientModule,
  ],
  controllers: [ApplicationController, AdminController],
  providers: [
    ApplicationAccessService,
    ApplicationValidationService,
    TemplateApiActionRunner,
    ApplicationActionService,
  ],
})
export class ApplicationModule {}
