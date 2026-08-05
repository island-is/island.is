import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'

import { CarRentalFeeCategoryService } from './car-rental-fee-category.service'
import { ApplicationsNotificationsModule } from '../../../notification/notifications.module'
import { RskRentalDayRateClientModule } from '@island.is/clients-rental-day-rate'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ApplicationsNotificationsModule,
    RskRentalDayRateClientModule,
  ],
  providers: [CarRentalFeeCategoryService],
  exports: [CarRentalFeeCategoryService],
})
export class CarRentalFeeCategoryModule {}
