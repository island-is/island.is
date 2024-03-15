import { HttpModule } from '@nestjs/axios'
import { Module, forwardRef } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { FjarsyslaModule } from '../fjarsysla/fjarsysla.module'
import { RecyclingPartnerModule } from '../recyclingPartner/recyclingPartner.module'
import { SamgongustofaModule } from '../samgongustofa/samgongustofa.module'
import { VehicleModule } from '../vehicle/vehicle.module'

import { RecyclingRequestModel } from './recyclingRequest.model'
import { RecyclingRequestResolver } from './recyclingRequest.resolver'
import { RecyclingRequestService } from './recyclingRequest.service'
import { RecyclingRequestAppSysResolver } from './recyclingRequestAppSys.resolver'
import { IcelandicTransportAuthorityModule } from '../../services/icelandicTransportAuthority.module'

@Module({
  imports: [
    HttpModule,
    VehicleModule,
    SequelizeModule.forFeature([RecyclingRequestModel]),
    FjarsyslaModule,
    forwardRef(() => RecyclingPartnerModule),
    forwardRef(() => SamgongustofaModule),
    forwardRef(() => IcelandicTransportAuthorityModule),
  ],
  providers: [
    RecyclingRequestResolver,
    RecyclingRequestAppSysResolver,
    RecyclingRequestService,
  ],
  exports: [RecyclingRequestService],
})
export class RecyclingRequestModule {}
