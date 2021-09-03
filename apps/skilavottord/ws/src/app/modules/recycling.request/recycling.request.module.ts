import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { SequelizeModule } from '@nestjs/sequelize'
import { RecyclingRequestModel } from './model/recycling.request.model'
import { RecyclingRequestService } from './recycling.request.service'
import { RecyclingRequestResolver } from './recycling.request.resolver'
import { VehicleModel } from '../vehicle/model/vehicle.model'
import { RecyclingPartnerDbModule } from '../recycling.partner/recycling.partner.module'
import { FjarsyslaModule } from '../fjarsysla/fjarsysla.module'
import { VehicleModule } from '../vehicle/vehicle.module'

@Module({
  imports: [
    HttpModule,
    SequelizeModule.forFeature([RecyclingRequestModel, VehicleModel]),
    FjarsyslaModule,
    RecyclingPartnerDbModule,
    VehicleModule,
  ],
  providers: [RecyclingRequestResolver, RecyclingRequestService],
  exports: [RecyclingRequestService],
})
export class RecyclingRequestModule {}
