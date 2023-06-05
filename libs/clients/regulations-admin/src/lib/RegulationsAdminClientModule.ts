import { Module } from '@nestjs/common'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'
import { RegulationsAdminClientService } from './RegulationsAdminClientService'

@Module({
  providers: [RegulationsAdminClientService, ApiConfiguration, ...exportedApis],
  exports: [RegulationsAdminClientService, ...exportedApis],
})
export class RegulationsAdminClientModule {}
