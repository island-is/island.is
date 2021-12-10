import { Module } from '@nestjs/common'

import { AccessControlModule } from '../accessControl'
import { AuthModule } from '../auth'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'

@Module({
  imports: [AuthModule, AccessControlModule],
  providers: [UserResolver, UserService],
})
export class UserModule {}
