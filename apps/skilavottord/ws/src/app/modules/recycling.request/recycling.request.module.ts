import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { RecyclingRequestModel } from './model/recycling.request.model'
import { RecyclingRequestService } from './recycling.request.service'
import { RecyclingRequestResolver } from './recycling.request.resolver'
import { VehicleModel } from '../vehicle/model/vehicle.model'

@Module({
  imports: [SequelizeModule.forFeature([RecyclingRequestModel, VehicleModel])],
  providers: [RecyclingRequestResolver, RecyclingRequestService],
})
export class RecyclingRequestModule {}
