import { Module } from '@nestjs/common'
import { UniversityOfIcelandApplicationClient } from './universityOfIcelandClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, UniversityOfIcelandApplicationClient],
  exports: [UniversityOfIcelandApplicationClient],
})
export class UniversityOfIcelandApplicationClientModule {}
