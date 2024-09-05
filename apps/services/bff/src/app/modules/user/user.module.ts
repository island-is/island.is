import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { IdsService } from '../ids/ids.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserService, IdsService],
})
export class UserModule {}
