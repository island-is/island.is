import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'

import { CarRentalFeeCategoryService } from './car-rental-fee-category.service'
import { ApplicationsNotificationsModule } from '../../../notification/notifications.module'
@Module({
  imports: [SharedTemplateAPIModule, ApplicationsNotificationsModule],
  providers: [CarRentalFeeCategoryService],
  exports: [CarRentalFeeCategoryService],
})
export class CarRentalFeeCategoryModule {}
