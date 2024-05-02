import { Module } from '@nestjs/common'
import { UniversityCareersClientModule } from '@island.is/clients/university-careers'
import { UniversityCareersResolver } from './universityCareers.resolver'
import { CmsModule } from '@island.is/cms'
import { UniversityCareersService } from './universityCareers.service'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  providers: [UniversityCareersResolver, UniversityCareersService],
  imports: [UniversityCareersClientModule, CmsModule, FeatureFlagModule],
})
export class UniversityCareersModule {}
