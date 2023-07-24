import { Module } from '@nestjs/common'
import { ResidencePermitClient } from './residencePermitClient.service'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'

@Module({
  providers: [ApiConfiguration, ResidencePermitClient, ...exportedApis],
  exports: [ResidencePermitClient],
})
export class ResidencePermitClientModule {}
