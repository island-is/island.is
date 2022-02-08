import { Module } from '@nestjs/common'
import { ApplicationApiProvider } from './apiConfiguration'

@Module({
  providers: [ApplicationApiProvider],
  exports: [ApplicationApiProvider],
})
export class ApplicationClientModule {}
