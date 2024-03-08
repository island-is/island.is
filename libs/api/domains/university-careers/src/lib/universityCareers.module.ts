import { Module } from '@nestjs/common'
import { UniversityCareersClientModule } from '@island.is/clients/university-careers'
import { UniversityCareersResolver } from './universityCareers.resolver'

@Module({
  providers: [UniversityCareersResolver],
  imports: [UniversityCareersClientModule],
})
export class UniversityCareersModule {}
