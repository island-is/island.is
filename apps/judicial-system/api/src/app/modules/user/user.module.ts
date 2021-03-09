import { Module } from '@nestjs/common'

import { AuditModule } from '../audit'
import { UserResolver } from './user.resolver'

@Module({
  imports: [AuditModule],
  providers: [UserResolver],
})
export class UserModule {}
