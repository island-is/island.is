import { AuthModule } from '@island.is/auth-nest-tools'
import { HealthDirectorateClientModule } from '@island.is/clients/health-directorate'
import { LshClientModule } from '@island.is/clients/lsh'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { Module } from '@nestjs/common'
import { QuestionnairesResolver } from './questionnaires.resolver'
import { QuestionnairesService } from './questionnaires.service'

@Module({
  imports: [
    LshClientModule,
    AuthModule,
    FeatureFlagModule,
    HealthDirectorateClientModule,
    CmsTranslationsModule,
  ],
  providers: [QuestionnairesResolver, QuestionnairesService],
  exports: [],
})
export class QuestionnairesModule {}
