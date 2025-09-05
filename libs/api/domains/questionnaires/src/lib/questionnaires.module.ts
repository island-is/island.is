import { Module } from '@nestjs/common'
import { LshClientModule } from '@island.is/clients/lsh'
import { QuestionnairesResolver } from './questionnaires.resolver'
import { QuestionnairesService } from './questionnaires.service'
import { AuthModule } from '@island.is/auth-nest-tools'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [LshClientModule, AuthModule, FeatureFlagModule],
  providers: [QuestionnairesResolver, QuestionnairesService],
  exports: [],
})
export class QuestionnairesModule {}
