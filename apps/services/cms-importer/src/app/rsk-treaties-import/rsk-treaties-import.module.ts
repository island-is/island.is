import { LoggingModule } from '@island.is/logging'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { createClient } from 'contentful-management'
import { CmsRepositoryModule } from '../repositories/cms/cms.module'
import { ManagementClientConfig } from '../repositories/cms/managementClient/managementClient.config'
import { ManagementClientService } from '../repositories/cms/managementClient/managementClient.service'
import { RskTreatiesRepository } from '../repositories/rsk-treaties/rskTreaties.repository'
import { RskTreatiesImportService } from './rsk-treaties-import.service'
import { Module } from '@nestjs/common'

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
    RskTreatiesRepository,
    {
      provide: 'contentful-management-client',
      useFactory: (config: ConfigType<typeof ManagementClientConfig>) => {
        return createClient({
          accessToken: config.cmsAccessToken,
        })
      },
      inject: [ManagementClientConfig.KEY],
    },
    RskTreatiesImportService,
  ],
})
export class RskTreatiesImportModule {}
