import { Module } from '@nestjs/common'

import { RecyclingFundClientService } from './recyclingFundClient.service'
import { RecyclingFundFetchProvider } from './recyclingFundFetchProvider'

@Module({
  providers: [RecyclingFundFetchProvider, RecyclingFundClientService],
  exports: [RecyclingFundClientService],
})
export class RecyclingFundClientModule {}
