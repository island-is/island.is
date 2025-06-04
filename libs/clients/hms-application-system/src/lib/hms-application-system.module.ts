import { Module } from '@nestjs/common'
import { exportedApis } from './apis'
import { ApiConfiguration } from './apiConfiguration'

@Module({
  providers: [ApiConfiguration, ...exportedApis],
  exports: [...exportedApis],
})
export class HmsApplicationSystemModule {}
