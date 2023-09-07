import { Module } from '@nestjs/common'
import { UniversityGatewayReykjavikUniversityClient } from './reykjavikUniversityClient.service'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'

@Module({
  providers: [
    ApiConfiguration,
    UniversityGatewayReykjavikUniversityClient,
    ...exportedApis,
  ],
  exports: [UniversityGatewayReykjavikUniversityClient],
})
export class UniversityGatewayReykjavikUniversityClientModule {}
