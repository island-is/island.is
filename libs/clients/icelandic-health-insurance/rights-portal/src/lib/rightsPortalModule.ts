import { Module } from '@nestjs/common'
import { exportedApis } from './providers'
import { SharedApiConfig } from './sharedApiConfig'

@Module({
  providers: [SharedApiConfig, ...exportedApis],
  exports: exportedApis,
})
export class RightsPortalClientModule {}
