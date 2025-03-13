import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { RecyclingPartnerModel } from './recyclingPartner.model'
import { RecyclingPartnerResolver } from './recyclingPartner.resolver'
import { RecyclingPartnerService } from './recyclingPartner.service'
import { MunicipalityModel } from '../municipality/municipality.model'

@Module({
  imports: [
    SequelizeModule.forFeature([RecyclingPartnerModel]),
    SequelizeModule.forFeature([MunicipalityModel]),
  ],
  providers: [RecyclingPartnerResolver, RecyclingPartnerService],
  exports: [RecyclingPartnerService],
})
export class RecyclingPartnerModule {}
