import { Module } from '@nestjs/common'
import { UniversityOfIcelandApiProvider } from './universityOfIcelandClient.provider'
import { UniversityOfIcelandService } from './universityOfIcelandClient.service'

@Module({
  providers: [UniversityOfIcelandApiProvider, UniversityOfIcelandService],
  exports: [UniversityOfIcelandService],
})
export class UniversityOfIcelandClientModule {}
