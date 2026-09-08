import { Module } from '@nestjs/common'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { LoggingModule } from '@island.is/logging'
import { AuthModule } from '@island.is/auth-nest-tools'

import { ApplicationModule } from '../application/application.module'
import { SdfController } from './sdf.controller'
import { SdfScreenService } from './sdf-screen.service'
import { I18nResolverService } from './i18n-resolver.service'
import { DelegationGuard } from '../application/guards/delegation.guard'
import { environment } from '../../../environments'

@Module({
  imports: [
    ApplicationApiCoreModule,
    ApplicationModule,
    CmsTranslationsModule,
    FeatureFlagModule,
    LoggingModule,
    AuthModule.register(environment.auth),
  ],
  controllers: [SdfController],
  providers: [SdfScreenService, I18nResolverService, DelegationGuard],
})
export class SdfModule {}
