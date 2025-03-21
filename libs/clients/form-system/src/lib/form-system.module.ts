import { Module } from '@nestjs/common'
import { exportedApis } from './FormSystemApiProvider'
import { ApiConfiguration } from './apiConfiguration'

@Module({
  controllers: [],
  providers: [ApiConfiguration, ...exportedApis],
  exports: [ApiConfiguration, ...exportedApis],
})
export class FormSystemClientModule {}
