import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { RecyclingPartnerModel } from './recyclingPartner.model'
import { RecyclingPartnerResolver } from './recyclingPartner.resolver'
import { RecyclingPartnerService } from './recyclingPartner.service'

@Module({
  imports: [SequelizeModule.forFeature([RecyclingPartnerModel])],
  providers: [RecyclingPartnerResolver, RecyclingPartnerService],
  exports: [RecyclingPartnerService],
})
export class RecyclingPartnerModule {}
