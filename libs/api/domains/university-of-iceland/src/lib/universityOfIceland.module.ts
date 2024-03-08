import { Module } from '@nestjs/common'
import { UniversityCareersModule } from '@island.is/clients/university-careers'
import { UniversityOfIcelandResolver } from './universityOfIceland.resolver'

@Module({
  providers: [UniversityOfIcelandResolver],
  imports: [UniversityCareersModule],
})
export class UniversityOfIcelandModule {}
