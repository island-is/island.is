import { Module } from '@nestjs/common'
import { UniversityOfAkureyriApplicationClient } from './universityOfAkureyriClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, UniversityOfAkureyriApplicationClient],
  exports: [UniversityOfAkureyriApplicationClient],
})
export class UniversityOfAkureyriApplicationClientModule {}
