import { LoggingModule } from '@island.is/logging'
import { ConfigModule } from '@nestjs/config'
import { CmsRepositoryModule } from '../../../../platform/cms.module'
import { ManagementClientConfig } from '../../../../platform/managementClient/managementClient.config'
import { RskTreatiesRepository } from '../../rskTreaties.repository'
import { RskTreatiesImportService } from './treaties.service'
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
  providers: [RskTreatiesRepository, RskTreatiesImportService],
})
export class RskTreatiesImportModule {}
