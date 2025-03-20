import { Module } from '@nestjs/common'
import { PracticalExamsResolver } from './practicalExams.resolver'
import { PracticalExamsService } from './practicalExams.service'
import { PracticalExamsClientModule } from '@island.is/clients/practical-exams-ver'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [PracticalExamsClientModule, FeatureFlagModule],
  providers: [PracticalExamsResolver, PracticalExamsService],
})
export class PracticalExamsModule {}
