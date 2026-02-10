import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'

import { CarRentalDayrateReturnsService } from './car-rental-dayrate-returns.service'
import { ApplicationsNotificationsModule } from '../../../notification/notifications.module'
import {
  VehiclesClientConfig,
  VehiclesClientModule,
} from '@island.is/clients/vehicles'
import { RskRentalDayRateClientModule } from '@island.is/clients-rental-day-rate'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ApplicationsNotificationsModule,
    VehiclesClientModule,
    RskRentalDayRateClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [VehiclesClientConfig],
    }),
  ],
  providers: [CarRentalDayrateReturnsService],
  exports: [CarRentalDayrateReturnsService],
})
export class CarRentalDayrateReturnsModule {}
