import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { UserService } from './user.service'
import { UserController } from './user.controller'
import { User } from './user.model'

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
