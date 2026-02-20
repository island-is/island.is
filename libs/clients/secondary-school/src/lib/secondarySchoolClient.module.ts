import { Module } from '@nestjs/common'
import { SecondarySchoolClient } from './secondarySchoolClient.service'
import { exportedApis, publicExportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, ...publicExportedApis, SecondarySchoolClient],
  exports: [SecondarySchoolClient],
})
export class SecondarySchoolClientModule {}
