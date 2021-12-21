import { Module } from '@nestjs/common'
import { ApiConfiguration } from './apiConfiguration'
import { SyslumennApi } from '../../gen/fetch'

@Module({
  providers: [ApiConfiguration],
  exports: [SyslumennApi],
})
export class SyslumennClientModule {}
