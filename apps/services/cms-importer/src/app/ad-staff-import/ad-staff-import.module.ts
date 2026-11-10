import { Module } from '@nestjs/common'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { LoggingModule } from '@island.is/logging'
import { createClient } from 'contentful-management'
import { ManagementClientConfig } from '../repositories/cms/managementClient/managementClient.config'
import { AdStaffImportService } from './ad-staff-import.service'
import { StaffCmsRepository } from './staffCms.repository'

@Module({
  imports: [
    LoggingModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ManagementClientConfig],
    }),
  ],
  providers: [
    {
      provide: 'contentful-management-client',
      useFactory: (config: ConfigType<typeof ManagementClientConfig>) =>
        createClient({ accessToken: config.cmsAccessToken }),
      inject: [ManagementClientConfig.KEY],
    },
    StaffCmsRepository,
    AdStaffImportService,
  ],
})
export class AdStaffImportModule {}
