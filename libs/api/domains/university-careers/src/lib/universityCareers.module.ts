import { Module } from '@nestjs/common'
import { UniversityCareersClientModule } from '@island.is/clients/university-careers'
import { UniversityCareersResolver } from './universityCareers.resolver'
import { CmsModule } from '@island.is/cms'
import { UniversityCareersService } from './universityCareers.service'

@Module({
  providers: [UniversityCareersResolver, UniversityCareersService],
  imports: [UniversityCareersClientModule, CmsModule],
})
export class UniversityCareersModule {}
