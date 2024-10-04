import { Module } from '@nestjs/common'

import { ApiConfiguration } from './apiConfiguration'
import { SyslumennService } from './syslumennClient.service'

@Module({
  providers: [SyslumennService, ApiConfiguration],
  exports: [SyslumennService],
})
export class SyslumennClientModule {}
