import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { VehicleModel } from './model/vehicle.model'
import { VehicleService } from './vehicle.service'
import { RecyclingRequestModel } from '../recycling.request/model/recycling.request.model'
import { RecyclingPartnerModel } from '../recycling.partner/model/recycling.partner.model'

@Module({
  imports: [
    SequelizeModule.forFeature([
      VehicleModel,
      RecyclingRequestModel,
      RecyclingPartnerModel,
    ]),
  ],
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}
