import { Module } from '@nestjs/common'

import { ApiConfiguration } from './api-configuration'
import { exportedApis } from './apis'

@Module({
  providers: [ApiConfiguration, ...exportedApis],
  exports: exportedApis,
})
export class DocumentProviderDashboardClientModule {}
