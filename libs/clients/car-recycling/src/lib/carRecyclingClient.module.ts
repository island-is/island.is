import { Module } from '@nestjs/common'

import { CarRecyclingClientService } from './carRecyclingClient.service'
import { CarRecyclingFetchProvider } from './carRecyclingFetchProvider'

@Module({
  providers: [CarRecyclingFetchProvider, CarRecyclingClientService],
  exports: [CarRecyclingClientService],
})
export class CarRecyclingClientModule {}
