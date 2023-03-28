import { Module } from '@nestjs/common'
import { UniversityOfIcelandClientModule } from '@island.is/clients/university-of-iceland'
import { UniversityOfIcelandResolver } from './universityOfIceland.resolver'
import { UniversityOfIcelandResolver2 } from './universityOfIceland_2.resolver'

@Module({
  providers: [UniversityOfIcelandResolver, UniversityOfIcelandResolver2],
  imports: [UniversityOfIcelandClientModule],
})
export class UniversityOfIcelandModule {}
