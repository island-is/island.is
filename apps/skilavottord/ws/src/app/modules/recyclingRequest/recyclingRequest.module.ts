import { Module, forwardRef } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { SequelizeModule } from '@nestjs/sequelize'

import { VehicleModule } from '../vehicle/vehicle.module'
import { RecyclingPartnerModule } from '../recyclingPartner/recyclingPartner.module'
import { SamgongustofaModule } from '../samgongustofa/samgongustofa.module'
import { FjarsyslaModule } from '../fjarsysla/fjarsysla.module'

import { RecyclingRequestModel } from './recyclingRequest.model'
import { RecyclingRequestService } from './recyclingRequest.service'
import { RecyclingRequestResolver } from './recyclingRequest.resolver'
import { RecyclingRequestAppSysResolver } from './recyclingRequestAppSys.resolver'

@Module({
  imports: [
    HttpModule,
    VehicleModule,
    SequelizeModule.forFeature([RecyclingRequestModel]),
    FjarsyslaModule,
    forwardRef(() => RecyclingPartnerModule),
    forwardRef(() => SamgongustofaModule),
  ],
  providers: [
    RecyclingRequestResolver,
    RecyclingRequestAppSysResolver,
    RecyclingRequestService,
  ],
  exports: [RecyclingRequestService],
})
export class RecyclingRequestModule {}
