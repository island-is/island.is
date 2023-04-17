import { Module } from '@nestjs/common'
import { ResidencePermitClient } from './residencePermitClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, ResidencePermitClient],
  exports: [ResidencePermitClient],
})
export class ResidencePermitClientModule {}
