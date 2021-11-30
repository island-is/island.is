import { Module, HttpModule, forwardRef } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { VehicleModule } from '../vehicle'
import { RecyclingPartnerModule } from '../recyclingPartner'
import { FjarsyslaModule } from '../fjarsysla'
import { RecyclingRequestModel } from './recyclingRequest.model'
import { RecyclingRequestService } from './recyclingRequest.service'
import { RecyclingRequestResolver } from './recyclingRequest.resolver'

@Module({
  imports: [
    HttpModule,
    VehicleModule,
    SequelizeModule.forFeature([RecyclingRequestModel]),
    FjarsyslaModule,
    forwardRef(() => RecyclingPartnerModule),
  ],
  providers: [RecyclingRequestResolver, RecyclingRequestService],
  exports: [RecyclingRequestService],
})
export class RecyclingRequestModule {}
