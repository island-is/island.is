import { Module } from '@nestjs/common'
import { LshClientModule } from '@island.is/clients/lsh'
import { HealthDirectorateClientModule } from '@island.is/clients/health-directorate'
import { QuestionnairesResolver } from './questionnaires.resolver'
import { QuestionnairesService } from './questionnaires.service'
import { AuthModule } from '@island.is/auth-nest-tools'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [
    LshClientModule,
    AuthModule,
    FeatureFlagModule,
    HealthDirectorateClientModule,
  ],
  providers: [QuestionnairesResolver, QuestionnairesService],
  exports: [],
})
export class QuestionnairesModule {}
