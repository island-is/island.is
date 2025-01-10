import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { MunicipalityModel } from './municipality.model'
import { MunicipalityResolver } from './municipality.resolver'
import { MunicipalityService } from './municipality.service'

@Module({
  imports: [SequelizeModule.forFeature([MunicipalityModel])],
  providers: [MunicipalityResolver, MunicipalityService],
  exports: [MunicipalityService],
})
export class MunicipalityModule {}
