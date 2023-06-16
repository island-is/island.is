import { Module } from '@nestjs/common'
import { RskProcuringConfigurationProvider } from './apiConfiguration'
import { RskProcuringClient } from './RskProcuringClient'

@Module({
  providers: [RskProcuringClient, RskProcuringConfigurationProvider],
  exports: [RskProcuringClient],
})
export class RskProcuringClientModule {}
