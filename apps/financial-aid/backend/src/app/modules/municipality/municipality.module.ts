import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { environment } from '../../../environments'

import { MunicipalityModel } from './models'
import { MunicipalityController } from './municipality.controller'
import { MunicipalityService } from './municipality.service'

@Module({
  imports: [SequelizeModule.forFeature([MunicipalityModel])],
  providers: [MunicipalityService],
  controllers: [MunicipalityController],
  exports: [MunicipalityService],
})
export class MunicipalityModule {}
