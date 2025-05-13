import { LoggingModule } from '@island.is/logging'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@island.is/nest/config'
import { ManagementClientConfig } from '../repositories/cms/managementClient/managementClient.config'
import {
  GrantsClientModule,
  RannisGrantsClientConfig,
} from '@island.is/clients/grants'
import { GrantImportService } from './grant-import.service'
import { CmsRepositoryModule } from '../repositories/cms/cms.module'
import { GrantsRepository } from '../repositories/grants/grants.repository'

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
