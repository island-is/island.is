import { LoggingModule } from '@island.is/logging'
import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigModule } from '@island.is/nest/config'
import { ManagementClientConfig } from './modules/managementClient/managementClient.config'
import { ManagementClientModule } from './modules/managementClient/managementClient.module'
import {
  GrantsClientModule,
  RannisGrantsClientConfig,
} from '@island.is/clients/grants'
import { CmsRepository } from './repositories/cms.repository'
import { ClientGrantsRepository } from './repositories/clientGrants.repository'

@Module({
  imports: [
    LoggingModule,
    GrantsClientModule,
    ManagementClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ManagementClientConfig, RannisGrantsClientConfig],
    }),
  ],
  providers: [AppService, CmsRepository, ClientGrantsRepository],
})
export class AppModule {}
