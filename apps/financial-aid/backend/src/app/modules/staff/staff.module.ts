import { EmailModule } from '@island.is/email-service'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { environment } from '../../../environments'

import { StaffModel } from './models/staff.model'
import { StaffController } from './staff.controller'
import { StaffService } from './staff.service'

@Module({
  imports: [
    SequelizeModule.forFeature([StaffModel]),
    EmailModule.register(environment.emailOptions),
  ],
  providers: [StaffService],
  controllers: [StaffController],
  exports: [StaffService],
})
export class StaffModule {}
