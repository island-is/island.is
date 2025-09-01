import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { EventLogModule } from '../event-log/eventLog.module'
import { InstitutionModule } from '../institution/institution.module'
import { User } from '../repository'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [
    forwardRef(() => EventLogModule),
    forwardRef(() => InstitutionModule),
    SequelizeModule.forFeature([User]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
