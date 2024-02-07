import { Module } from '@nestjs/common'
import { AgriculturalUniversityOfIcelandApplicationClient } from './agriculturalUniversityOfIcelandClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [
    ...exportedApis,
    AgriculturalUniversityOfIcelandApplicationClient,
  ],
  exports: [AgriculturalUniversityOfIcelandApplicationClient],
})
export class AgriculturalUniversityOfIcelandApplicationClientModule {}
