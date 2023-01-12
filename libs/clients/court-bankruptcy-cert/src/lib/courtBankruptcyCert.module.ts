import { IdsClientConfig } from '@island.is/nest/config'
import { Module } from '@nestjs/common'
import { ApiConfig } from './api.config'
import { CourtBankruptcyCertService } from './courtBankruptcyCert.service'
import { exportedApis } from './providers'

@Module({
  imports: [IdsClientConfig.registerOptional()],
  providers: [ApiConfig, CourtBankruptcyCertService, ...exportedApis],
  exports: [CourtBankruptcyCertService],
})
export class CourtBankruptcyCertClientModule {}
