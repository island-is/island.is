import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { RecyclingRequestModel } from './model/recycling.request.model'
import { RecyclingRequestService } from './recycling.request.service'
import { RecyclingRequestResolver } from './recycling.request.resolver'
import { VehicleModel } from '../vehicle/model/vehicle.model'
import { SamgongustofaModule } from '../samgongustofa/samgongustofa.module'
import { FjarsyslaModule } from '../fjarsysla/fjarsysla.module'

@Module({
  imports: [
    SequelizeModule.forFeature([RecyclingRequestModel, VehicleModel]),
    FjarsyslaModule,
  ],
  providers: [RecyclingRequestResolver, RecyclingRequestService],
  exports: [RecyclingRequestService],
})
export class RecyclingRequestModule {}
