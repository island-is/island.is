import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { VehicleModel } from './model/vehicle.model'
import { VehicleService } from './vehicle.service'
import { VehicleResolver } from './vehicle.resolver'
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
  providers: [VehicleResolver, VehicleService],
})
export class VehicleModule {}
