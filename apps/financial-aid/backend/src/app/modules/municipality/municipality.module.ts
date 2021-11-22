import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AidModule } from '../aid/aid.module'
import { StaffModule } from '../staff/staff.module'

import { MunicipalityModel } from './models'
import { MunicipalityController } from './municipality.controller'
import { MunicipalityService } from './municipality.service'

@Module({
  imports: [
    SequelizeModule.forFeature([MunicipalityModel]),
    StaffModule,
    AidModule,
  ],
  providers: [MunicipalityService],
  controllers: [MunicipalityController],
  exports: [MunicipalityService],
})
export class MunicipalityModule {}
