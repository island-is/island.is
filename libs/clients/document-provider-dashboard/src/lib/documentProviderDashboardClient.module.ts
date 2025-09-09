import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { DocumentProviderDashboardClientConfig } from './documentProviderDashboardClient.config'
import { DocumentProviderDashboardProvider } from './documentProviderDashboardClient.provider'
import { DocumentProviderDashboardClientService } from './documentProviderDashboardClient.service'

@Module({
  imports: [
    ConfigModule.forRoot({ load: [DocumentProviderDashboardClientConfig] }),
  ],
  providers: [
    DocumentProviderDashboardProvider,
    DocumentProviderDashboardClientService,
  ],
  exports: [DocumentProviderDashboardClientService],
})
export class DocumentProviderDashboardClientModule {}
