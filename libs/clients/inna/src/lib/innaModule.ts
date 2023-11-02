import { Module } from '@nestjs/common'
import { ApiConfig } from './apiConfig'
import { InnaService } from './inna.service'
import { exportedApis } from './providers'

@Module({
  providers: [InnaService, ApiConfig, ...exportedApis],
  exports: [InnaService],
})
export class InnaClientModule {}
