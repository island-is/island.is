import { Module } from '@nestjs/common'
import { publicExportedApis } from './apiConfiguration'
import { SecondarySchoolPublicClient } from './secondarySchoolPublicClient.service'

@Module({
  providers: [...publicExportedApis, SecondarySchoolPublicClient],
  exports: [SecondarySchoolPublicClient],
})
export class SecondarySchoolPublicClientModule {}
