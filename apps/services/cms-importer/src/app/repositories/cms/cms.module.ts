import { Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { createClient } from 'contentful-management'
import { ManagementClientService } from './managementClient/managementClient.service'
import { ManagementClientConfig } from './managementClient/managementClient.config'
import { CmsRepository } from './cms.repository'

@Module({
  providers: [
    ManagementClientService,
    CmsRepository,
    {
      provide: 'contentful-management-client',
      useFactory: (config: ConfigType<typeof ManagementClientConfig>) => {
        return createClient({
          accessToken: config.cmsAccessToken,
        })
      },
      inject: [ManagementClientConfig.KEY],
    },
  ],
  exports: [CmsRepository],
})
export class CmsRepositoryModule {}
