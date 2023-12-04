import { Module } from '@nestjs/common'
import { ReykjavikUniversityApplicationClient } from './reykjavikUniversityClient.service'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'

@Module({
  providers: [
    ApiConfiguration,
    ReykjavikUniversityApplicationClient,
    ...exportedApis,
  ],
  exports: [ReykjavikUniversityApplicationClient],
})
export class ReykjavikUniversityApplicationClientModule {}
