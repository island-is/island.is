import { Module } from '@nestjs/common'
import { SecondarySchoolClient } from './secondarySchoolClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, SecondarySchoolClient],
  exports: [SecondarySchoolClient],
})
export class SecondarySchoolClientModule {}
