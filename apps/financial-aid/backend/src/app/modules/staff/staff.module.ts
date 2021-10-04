import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { StaffModel } from './models'
import { StaffController } from './staff.controller'
import { StaffService } from './staff.service'

@Module({
  imports: [SequelizeModule.forFeature([StaffModel])],
  providers: [StaffService],
  controllers: [StaffController],
  exports: [StaffService],
})
export class StaffModule {}
