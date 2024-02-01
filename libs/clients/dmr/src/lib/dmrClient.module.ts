import { Module } from '@nestjs/common'
import { DmrClientService } from './dmrClient.service'
import { DefaultApi as DmrApi } from '../../gen/fetch/apis'

@Module({
  providers: [DmrApi, DmrClientService],
  exports: [DmrClientService],
})
export class DmrClientModule {}
