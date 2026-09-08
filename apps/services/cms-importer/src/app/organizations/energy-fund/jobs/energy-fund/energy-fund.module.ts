import { LoggingModule } from '@island.is/logging'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@island.is/nest/config'
import { ManagementClientConfig } from '../../../../platform/managementClient/managementClient.config'
import { CmsRepositoryModule } from '../../../../platform/cms.module'
import { EnergyGrantsRepository } from './energy-fund.repository'
import { EnergyFundImportService } from './energy-fund.service'

@Module({
  imports: [
    LoggingModule,
    CmsRepositoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ManagementClientConfig],
    }),
  ],
  providers: [EnergyGrantsRepository, EnergyFundImportService],
})
export class EnergyFundImportModule {}
