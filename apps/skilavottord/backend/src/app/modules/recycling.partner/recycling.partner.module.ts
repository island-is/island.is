import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { RecyclingRequestModel } from '../recycling.request/model/recycling.request.model'
import { RecyclingPartnerModel } from './model/recycling.partner.model'
import { RecyclingPartnerService } from './recycling.partner.service'

@Module({
  imports: [
    SequelizeModule.forFeature([RecyclingPartnerModel, RecyclingRequestModel]),
  ],
  providers: [RecyclingPartnerService],
  exports: [RecyclingPartnerService],
})
export class RecyclingPartnerDbModule {}
