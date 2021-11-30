import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { VehicleModel } from './vehicle.model'
import { VehicleService } from './vehicle.service'
import { VehicleResolver } from './vehicle.resolver'

@Module({
  imports: [SequelizeModule.forFeature([VehicleModel])],
  providers: [VehicleResolver, VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}
