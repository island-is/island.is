import { Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { ManagementClientConfig } from './managementClient.config'
import { createClient } from 'contentful-management'
import { ManagementClientService } from './managementClient.service'

@Module({
  providers: [
    ManagementClientService,
    {
      provide: 'contentful-management-client',
      useFactory: (config: ConfigType<typeof ManagementClientConfig>) =>
        createClient({
          accessToken: config.cmsAccessToken,
        }),
      inject: [ManagementClientConfig.KEY],
    },
  ],
  exports: [ManagementClientService],
})
export class ManagementClientModule {}
