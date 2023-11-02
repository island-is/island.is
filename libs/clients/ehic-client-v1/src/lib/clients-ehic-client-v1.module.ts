import { Module } from '@nestjs/common'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'

@Module({
  exports: [...exportedApis],
  providers: [ApiConfiguration, ...exportedApis],
})
export class EhicClientModule {}
