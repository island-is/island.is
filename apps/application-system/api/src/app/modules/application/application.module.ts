import { FileStorageModule } from '@island.is/file-storage'
import { Module } from '@nestjs/common'

import { TemplateAPIModule } from '@island.is/application/template-api-modules'
import { AuthModule } from '@island.is/auth-nest-tools'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { SigningModule } from '@island.is/dokobit-signing'
import { AuditModule } from '@island.is/nest/audit'

import { environment } from '../../../environments'
import { AdminController } from './admin.controller'
import { ApplicationController } from './application.controller'

import { ApplicationAccessService } from './tools/applicationAccess.service'

import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import {
  ApplicationFilesModule,
  createBullModule,
} from '@island.is/application/api/files'
import { HistoryModule } from '@island.is/application/api/history'
import { PaymentModule } from '@island.is/application/api/payment'
import { AuthPublicApiClientModule } from '@island.is/clients/auth/public-api'
import { LoggingModule } from '@island.is/logging'
import { AwsModule } from '@island.is/nest/aws'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { ApplicationActionService } from './application-action.service'
import { ApplicationChargeModule } from './charge/application-charge.module'
import { ApplicationValidationService } from './tools/applicationTemplateValidation.service'
import { TemplateApiActionRunner } from './tools/templateApiActionRunner.service'

@Module({
  imports: [
    PaymentModule,
    AuditModule,
    AuthModule.register(environment.auth),
    TemplateAPIModule.register(environment.templateApi),
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
