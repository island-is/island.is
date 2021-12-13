import { Module } from '@nestjs/common'

import { AccessControlModule } from '../accessControl'
import { AuthModule } from '../auth'
import { UserResolver } from './user.resolver'

@Module({
  imports: [AuthModule, AccessControlModule],
  providers: [UserResolver],
})
export class UserModule {}
