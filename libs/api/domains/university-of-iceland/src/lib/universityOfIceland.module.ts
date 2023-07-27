import { Module } from '@nestjs/common'
import { UniversityOfIcelandClientModule } from '@island.is/clients/university-of-iceland'
import { UniversityOfIcelandResolver } from './universityOfIceland.resolver'

@Module({
  providers: [UniversityOfIcelandResolver],
  imports: [UniversityOfIcelandClientModule],
})
export class UniversityOfIcelandModule {}
