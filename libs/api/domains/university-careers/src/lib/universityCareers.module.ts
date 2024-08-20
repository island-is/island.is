import { Module } from '@nestjs/common'
import { UniversityCareersClientModule } from '@island.is/clients/university-careers'
import { CmsModule } from '@island.is/cms'
import { UniversityCareersService } from './universityCareers.service'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import {
  InstitutionResolver,
  StudentTrackResolver,
  TrackHistoryResolver,
} from './resolvers'

@Module({
  providers: [
    InstitutionResolver,
    StudentTrackResolver,
    TrackHistoryResolver,
    UniversityCareersService,
  ],
  imports: [UniversityCareersClientModule, CmsModule, FeatureFlagModule],
})
export class UniversityCareersModule {}
