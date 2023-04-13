import { Module } from '@nestjs/common'
import { AuthModule } from '@island.is/auth-nest-tools'
import { ConsultationPortalClientModule } from '@island.is/clients/consultation-portal'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { CaseResultResolver } from './cases/cases.resolver'
import { CaseResultService } from './cases/cases.service'
import { DocumentService } from './documents/documents.service'
import { DocumentResolver } from './documents/documents.resolver'
import { AllTypesResultService } from './types/types.service'
import { AllTypesResultResolver } from './types/types.resolver'
import { StatisticsResultService } from './statistics/statistics.service'
import { StatisticsResultResolver } from './statistics/statistics.resolver'
import { UserService } from './user/user.service'
import { UserResolver } from './user/user.resolver'
import { ConfigModule } from '@nestjs/config'
import { FileStorageConfig, FileStorageModule } from '@island.is/file-storage'

@Module({
  providers: [
    CaseResultResolver,
    CaseResultService,
    DocumentService,
    DocumentResolver,
    AllTypesResultService,
    AllTypesResultResolver,
    StatisticsResultService,
    StatisticsResultResolver,
    UserService,
    UserResolver,
  ],
  imports: [
    ConsultationPortalClientModule,
    AuthModule,
    FeatureFlagModule,
    ConfigModule.forRoot({ isGlobal: true, load: [FileStorageConfig] }),
    FileStorageModule
  ],
  exports: [],
})
export class ConsultationPortalModule {}
