import { Module } from '@nestjs/common'

import { ApiConfiguration } from './api-configuration'
import { exportedApis } from './apis'

@Module({
  providers: [ApiConfiguration, ...exportedApis],
  exports: exportedApis,
})
export class DocumentProviderDashboardClientModule {}


/*
import { ConfigModule } from '@nestjs/config'
import { DocumentProviderDashboardClientConfig } from './documentProviderDashboardClient.config'
import { DocumentProviderDashboardProvider } from './documentProviderDashboardClient.provider'
import { DocumentProviderDashboardClientService } from './documentProviderDashboardClient.service'

@Module({
  imports: [
    ConfigModule.forFeature(DocumentProviderDashboardClientConfig),
  ],
  providers: [
    DocumentProviderDashboardProvider,
    DocumentProviderDashboardClientService,
  ],
  exports: [DocumentProviderDashboardClientService],
})
export class DocumentProviderDashboardClientModule {}
*/