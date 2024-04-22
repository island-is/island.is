import { Module } from '@nestjs/common'
import { BifrostUniversityApplicationClient } from './bifrostUniversityClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, BifrostUniversityApplicationClient],
  exports: [BifrostUniversityApplicationClient],
})
export class BifrostUniversityApplicationClientModule {}
