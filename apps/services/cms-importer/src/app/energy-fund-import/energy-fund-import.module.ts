import { LoggingModule } from '@island.is/logging'
import { Module } from '@nestjs/common'
import { ConfigModule, type ConfigType } from '@island.is/nest/config'
import { ManagementClientConfig } from '../repositories/cms/managementClient/managementClient.config'
import { EnergyFundImportService } from './energy-fund-import.service'
import { CmsRepositoryModule } from '../repositories/cms/cms.module'
import { ManagementClientService } from '../repositories/cms/managementClient/managementClient.service'
import { createClient } from 'contentful-management'
import { EnergyGrantsRepository } from '../repositories/energy-grants/energyGrants.repository'

@Module({
  imports: [
    LoggingModule,
    CmsRepositoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ManagementClientConfig],
    }),
  ],
  providers: [
    ManagementClientService,
    EnergyGrantsRepository,
    {
      provide: 'contentful-management-client',
      useFactory: (config: ConfigType<typeof ManagementClientConfig>) => {
        return createClient({
          accessToken: config.cmsAccessToken,
        })
      },
      inject: [ManagementClientConfig.KEY],
    },
    EnergyFundImportService,
  ],
})
export class EnergyFundImportModule {}
