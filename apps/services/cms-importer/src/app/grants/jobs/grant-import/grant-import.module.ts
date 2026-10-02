import { LoggingModule } from '@island.is/logging'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@island.is/nest/config'
import { ManagementClientConfig } from '../../../platform/managementClient/managementClient.config'
import {
  GrantsClientModule,
  RannisGrantsClientConfig,
} from '@island.is/clients/grants'
import { GrantImportService } from './grant-import.service'
import { CmsRepositoryModule } from '../../../platform/cms.module'
import { GrantsRepository } from './grant-import.repository'

@Module({
  imports: [
    LoggingModule,
    GrantsClientModule,
    CmsRepositoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ManagementClientConfig, RannisGrantsClientConfig],
    }),
  ],
  providers: [GrantImportService, GrantsRepository],
})
export class GrantImportModule {}
