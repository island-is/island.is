import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { RecyclingRequestModel } from '../recycling.request/model/recycling.request.model'
import { VehicleModel } from '../vehicle/model/vehicle.model'
import { VehicleOwnerModel } from './model/vehicle.owner.model'
import { VehicleOwnerService } from './vehicle.owner.service'

@Module({
  imports: [
    SequelizeModule.forFeature([
      VehicleOwnerModel,
      VehicleModel,
      RecyclingRequestModel,
    ]),
  ],
  providers: [VehicleOwnerService],
})
export class VehicleOwnerModule {}
