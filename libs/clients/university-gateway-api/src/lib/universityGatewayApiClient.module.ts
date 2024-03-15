import { Module } from '@nestjs/common'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'

export
@Module({
  providers: [ApiConfiguration, ...exportedApis],
  exports: exportedApis,
})
class UniversityGatewayApiClientModule {}
