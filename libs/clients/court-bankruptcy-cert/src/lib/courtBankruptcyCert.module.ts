import { IdsClientConfig } from '@island.is/nest/config'
import { Module } from '@nestjs/common'
import { ApiConfig } from './api.config'
import { exportedApis } from './providers'

@Module({
  imports: [IdsClientConfig.registerOptional()],
  providers: [ApiConfig, CourtBankruptcyCertService, ...exportedApis],
  exports: exportedApis,
})
export class CourtBankruptcyCertClientModule {}
