import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { VehicleModel } from './model/vehicle.model'
import { VehicleService } from './vehicle.service'
import { VehicleResolver } from './vehicle.resolver'
import { RecyclingRequestModel } from '../recycling.request/model/recycling.request.model'

@Module({
  imports: [SequelizeModule.forFeature([VehicleModel, RecyclingRequestModel])],
  providers: [VehicleResolver, VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}
