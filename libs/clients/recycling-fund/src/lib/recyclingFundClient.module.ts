import { Module } from '@nestjs/common'

import { RecyclingFundClientService } from './recyclingFundClient.service'

@Module({
  providers: [RecyclingFundClientService],
  exports: [RecyclingFundClientService],
})
export class RecyclingFundClientModule {}
