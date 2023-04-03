import { Module } from '@nestjs/common'
import { ApiConfig } from './rightsPortalProvider'
import { exportedApis } from './providers'

@Module({
  providers: [ApiConfig, ...exportedApis],
  exports: exportedApis,
})
export class RightsPortalClientModule {}
