import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AidModule } from '../aid/aid.module'
import { StaffModule } from '../staff/staff.module'
import { ApiUserService } from './user.service'
import { ApiUserModel } from './models/user.model'
import { ApiUserController } from './user.controller'

@Module({
  imports: [SequelizeModule.forFeature([ApiUserModel]), StaffModule, AidModule],
  providers: [ApiUserService],
  controllers: [ApiUserController],
  exports: [ApiUserService],
})
export class ApiUserModule {}
