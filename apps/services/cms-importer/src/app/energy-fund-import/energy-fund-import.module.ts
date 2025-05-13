import { LoggingModule } from '@island.is/logging'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@island.is/nest/config'
import { ManagementClientConfig } from '../repositories/cms/managementClient/managementClient.config'
import { EnergyGrantsRepository } from '../repositories/energyGrants/energyGrants.repository'
import { EnergyFundImportService } from './energy-fund-import.service'
import { CmsRepositoryModule } from '../repositories/cms/cms.module'

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
