import { Module } from '@nestjs/common'
import { SecondarySchoolClient } from './secondarySchoolClient.service'
import { exportedApis, publicProgrammesApiProvider } from './apiConfiguration'

@Module({
  providers: [
    ...exportedApis,
    publicProgrammesApiProvider,
    SecondarySchoolClient,
  ],
  exports: [SecondarySchoolClient],
})
export class SecondarySchoolClientModule {}
