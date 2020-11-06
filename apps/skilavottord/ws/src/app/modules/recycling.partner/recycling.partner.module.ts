import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { RecyclingRequestModel } from '../recycling.request/model/recycling.request.model'
import { RecyclingPartnerModel } from './model/recycling.partner.model'
import { RecyclingPartnerResolver } from './recycling.partner.resolver'
import { RecyclingPartnerService } from './recycling.partner.service'

@Module({
  imports: [
    SequelizeModule.forFeature([RecyclingPartnerModel, RecyclingRequestModel]),
  ],
  providers: [RecyclingPartnerResolver, RecyclingPartnerService],
  exports: [RecyclingPartnerService],
})
export class RecyclingPartnerDbModule {}
