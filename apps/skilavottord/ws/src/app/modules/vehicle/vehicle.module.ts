import { forwardRef,Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { SamgongustofaModule } from '../samgongustofa/samgongustofa.module'

import { VehicleModel } from './vehicle.model'
import { VehicleResolver } from './vehicle.resolver'
import { VehicleService } from './vehicle.service'

@Module({
  imports: [
    SequelizeModule.forFeature([VehicleModel]),
    forwardRef(() => SamgongustofaModule),
  ],
  providers: [VehicleResolver, VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}
