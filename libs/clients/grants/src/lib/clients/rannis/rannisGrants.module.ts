import { Module } from '@nestjs/common'
import { RannisGrantsClientService } from './rannisGrants.service'

@Module({
  providers: [RannisGrantsClientService],
  exports: [RannisGrantsClientService],
})
export class RannisGrantsClientModule {}
