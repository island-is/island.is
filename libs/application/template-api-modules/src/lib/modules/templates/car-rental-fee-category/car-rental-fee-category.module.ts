import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'

import { CarRentalFeeCategoryService } from './car-rental-fee-category.service'
import { ApplicationsNotificationsModule } from '../../../notification/notifications.module'
import { VehiclesClientConfig, VehiclesClientModule } from '@island.is/clients/vehicles'
import { ConfigModule } from '@nestjs/config'
@Module({
  imports: [
    SharedTemplateAPIModule, 
    ApplicationsNotificationsModule,
    VehiclesClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        VehiclesClientConfig,
      ],
    }),
  ],
  providers: [
    CarRentalFeeCategoryService
  ],
  exports: [
    CarRentalFeeCategoryService

  ],
})
export class CarRentalFeeCategoryModule {}
