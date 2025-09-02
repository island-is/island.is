import { Module } from '@nestjs/common'
import { LshClientService } from './lsh.service'
import { LshApiProvider } from './lsh.provider'

@Module({
  providers: [LshClientService, LshApiProvider],
  exports: [LshClientService],
})
export class LshClientModule {}
