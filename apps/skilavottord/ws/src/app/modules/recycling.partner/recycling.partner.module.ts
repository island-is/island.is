import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { RecyclingPartnerModel } from './recycling.partner.model'
import { RecyclingPartnerResolver } from './recycling.partner.resolver'
import { RecyclingPartnerService } from './recycling.partner.service'

@Module({
  imports: [SequelizeModule.forFeature([RecyclingPartnerModel])],
  providers: [RecyclingPartnerResolver, RecyclingPartnerService],
  exports: [RecyclingPartnerService],
})
export class RecyclingPartnerModule {}
