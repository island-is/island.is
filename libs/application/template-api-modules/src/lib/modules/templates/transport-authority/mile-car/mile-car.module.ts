import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { MileCarService } from './mile-car.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
import { VehiclesClientModule } from '@island.is/clients/vehicles'
import { VehiclesMileageClientModule } from '@island.is/clients/vehicles-mileage'
@Module({
  imports: [
    SharedTemplateAPIModule,
    ApplicationsNotificationsModule,
    VehiclesClientModule,
    VehiclesMileageClientModule,
  ],
  providers: [MileCarService],
  exports: [MileCarService],
})
export class MileCarModule {}
