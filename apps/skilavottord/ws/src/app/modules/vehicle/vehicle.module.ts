import { Module, forwardRef } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { VehicleModel } from './vehicle.model'
import { VehicleService } from './vehicle.service'
import { VehicleResolver } from './vehicle.resolver'
import { VehicleAppSysResolver } from './vehicleAppSys.resolver'
import { SamgongustofaModule } from '../samgongustofa/samgongustofa.module'

@Module({
  imports: [
    SequelizeModule.forFeature([VehicleModel]),
    forwardRef(() => SamgongustofaModule),
  ],
  providers: [VehicleAppSysResolver, VehicleResolver, VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}
