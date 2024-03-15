import { Module } from '@nestjs/common'
import { HolarUniversityApplicationClient } from './holarUniversityClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, HolarUniversityApplicationClient],
  exports: [HolarUniversityApplicationClient],
})
export class HolarUniversityApplicationClientModule {}
