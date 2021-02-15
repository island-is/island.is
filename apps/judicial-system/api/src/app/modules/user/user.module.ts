import { Module } from '@nestjs/common'

import { AuthModule } from '../auth'
import { AuditModule } from '../audit'
import { UserResolver } from './user.resolver'

@Module({
  imports: [AuthModule, AuditModule],
  providers: [UserResolver],
})
export class UserModule {}
