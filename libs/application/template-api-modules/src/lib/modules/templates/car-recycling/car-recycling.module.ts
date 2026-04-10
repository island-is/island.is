import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'
import { CarRecyclingService } from './car-recycling.service'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { CarRecyclingClientModule } from '@island.is/clients/car-recycling'
import { VehiclesClientModule } from '@island.is/clients/vehicles'
import { RecyclingFundClientModule } from '@island.is/clients/recycling-fund'

@Module({
  imports: [
    CarRecyclingClientModule,
    SharedTemplateAPIModule,
    ApplicationApiCoreModule,
    VehiclesClientModule,
    RecyclingFundClientModule,
  ],
  providers: [CarRecyclingService],
  exports: [CarRecyclingService],
})
export class CarRecyclingModule {}
