import { Module } from '@nestjs/common'
import { exportedApis } from './apis'
import { ApiConfiguration } from './apiConfiguration'

@Module({
  exports: exportedApis,
  providers: [ApiConfiguration, ...exportedApis],
})
export class VMSTModule {}
