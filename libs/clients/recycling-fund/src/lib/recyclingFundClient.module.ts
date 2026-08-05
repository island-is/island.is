import { Module } from '@nestjs/common'
import { RecyclingFundClientService } from './recyclingFundClient.service'
import { apiProvider } from './apiProvider'

@Module({
  providers: [...apiProvider, RecyclingFundClientService],
  exports: [RecyclingFundClientService],
})
export class RecyclingFundClientModule {}
