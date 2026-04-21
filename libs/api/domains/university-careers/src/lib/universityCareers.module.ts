import { Module } from '@nestjs/common'
import { UniversityCareersClientModule } from '@island.is/clients/university-careers'
import { CmsModule } from '@island.is/cms'
import { UniversityCareersService } from './universityCareers.service'
import { UniversityCareersServiceMock } from './universityCareers.mock.service'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import {
  InstitutionResolver,
  StudentTrackResolver,
  TrackHistoryResolver,
} from './resolvers'

const isMock = process.env['API_MOCKS'] === 'true'

@Module({
  providers: [
    InstitutionResolver,
    StudentTrackResolver,
    TrackHistoryResolver,
    {
      provide: UniversityCareersService,
      useClass: isMock ? UniversityCareersServiceMock : UniversityCareersService,
    },
  ],
  imports: [UniversityCareersClientModule, CmsModule, FeatureFlagModule],
})
export class UniversityCareersModule {}
