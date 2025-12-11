import { LoggingModule } from '@island.is/logging'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { createClient } from 'contentful-management'
import { CmsRepositoryModule } from '../repositories/cms/cms.module'
import { ManagementClientConfig } from '../repositories/cms/managementClient/managementClient.config'
import { ManagementClientService } from '../repositories/cms/managementClient/managementClient.service'
import { FSREBuildingsRepository } from '../repositories/fsre-buildings/fsreBuildings.repository'
import { FSREBuildingsImportService } from './fsre-buildings.service'
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
    FSREBuildingsRepository,
    {
      provide: 'contentful-management-client',
      useFactory: (config: ConfigType<typeof ManagementClientConfig>) => {
        return createClient({
          accessToken: config.cmsAccessToken,
        })
      },
      inject: [ManagementClientConfig.KEY],
    },
    FSREBuildingsImportService,
  ],
})
export class FSREBuildingsImportModule {}
