import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AidModule } from '../aid/aid.module'
import { StaffModule } from '../staff/staff.module'
import { UserService } from './user.service'
import { ApiUserModel } from './user.model'

@Module({
  imports: [SequelizeModule.forFeature([ApiUserModel]), StaffModule, AidModule],
  providers: [UserService],
  exports: [UserService],
})
export class ApiUserModule {}
