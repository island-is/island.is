import { Module, HttpModule, forwardRef } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { VehicleModule } from '../vehicle'
import { RecyclingPartnerModule } from '../recycling.partner'
import { FjarsyslaModule } from '../fjarsysla'
import { RecyclingRequestModel } from './recycling.request.model'
import { RecyclingRequestService } from './recycling.request.service'
import { RecyclingRequestResolver } from './recycling.request.resolver'

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
