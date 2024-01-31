import { Module } from '@nestjs/common'
import { DmrClientService } from './dmrClient.service'

@Module({
  providers: [DmrClientService],
  exports: [DmrClientService],
})
export class DmrClientModule {}
