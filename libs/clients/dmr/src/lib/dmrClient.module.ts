import { Module } from '@nestjs/common'
import { DmrClientService } from './dmrClient.service'
import { DmrApiProvider } from './dmrClient.provider'

@Module({
  providers: [DmrApiProvider, DmrClientService],
  exports: [DmrClientService],
})
export class DmrClientModule {}
