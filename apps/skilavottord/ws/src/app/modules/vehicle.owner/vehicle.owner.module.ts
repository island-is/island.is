import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { VehicleOwnerModel } from '../models'
import { VehicleOwnerResolver } from './vehicle.owner.resolver'
import { VehicleOwnerService } from './vehicle.owner.service'

@Module({
  imports: [SequelizeModule.forFeature([VehicleOwnerModel])],
  providers: [VehicleOwnerResolver, VehicleOwnerService],
})
export class VehicleOwnerModule {}
