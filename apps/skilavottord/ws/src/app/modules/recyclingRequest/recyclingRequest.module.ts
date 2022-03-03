import { forwardRef,HttpModule, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { FjarsyslaModule } from '../fjarsysla/fjarsysla.module'
import { RecyclingPartnerModule } from '../recyclingPartner/recyclingPartner.module'
import { SamgongustofaModule } from '../samgongustofa/samgongustofa.module'
import { VehicleModule } from '../vehicle/vehicle.module'

import { RecyclingRequestModel } from './recyclingRequest.model'
import { RecyclingRequestResolver } from './recyclingRequest.resolver'
import { RecyclingRequestService } from './recyclingRequest.service'

@Module({
  imports: [
    HttpModule,
    VehicleModule,
    SequelizeModule.forFeature([RecyclingRequestModel]),
    FjarsyslaModule,
    forwardRef(() => RecyclingPartnerModule),
    forwardRef(() => SamgongustofaModule),
  ],
  providers: [RecyclingRequestResolver, RecyclingRequestService],
  exports: [RecyclingRequestService],
})
export class RecyclingRequestModule {}
