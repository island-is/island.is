import { Module } from '@nestjs/common'
import { RskProcuringClient } from './RskProcuringClient'

@Module({
  providers: [RskProcuringClient],
  exports: [RskProcuringClient],
})
export class RskProcuringClientModule {}
