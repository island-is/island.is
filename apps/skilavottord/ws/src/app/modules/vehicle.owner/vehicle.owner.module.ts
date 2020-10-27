import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { VehicleModel } from '../vehicle/model/vehicle.model'
import { VehicleOwnerModel } from './model/vehicle.owner.model'
//import { VehicleModel, VehicleOwnerModel } from '../models'
import { VehicleOwnerResolver } from './vehicle.owner.resolver'
import { VehicleOwnerService } from './vehicle.owner.service'

@Module({
  imports: [SequelizeModule.forFeature([VehicleOwnerModel, VehicleModel])],
  providers: [VehicleOwnerResolver, VehicleOwnerService],
})
export class VehicleOwnerModule {}
