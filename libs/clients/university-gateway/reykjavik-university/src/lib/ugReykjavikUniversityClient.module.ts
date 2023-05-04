import { Module } from '@nestjs/common'
import { UgReykjavikUniversityClient } from './ugReykjavikUniversityClient.service'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'

@Module({
  providers: [ApiConfiguration, UgReykjavikUniversityClient, ...exportedApis],
  exports: [UgReykjavikUniversityClient],
})
export class UgReykjavikUniversityClientModule {}
