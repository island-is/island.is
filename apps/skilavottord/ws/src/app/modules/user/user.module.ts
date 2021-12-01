import { Module } from '@nestjs/common'

import { AuthModule } from '../auth'
import { UserResolver } from './user.resolver'

@Module({
  imports: [AuthModule],
  providers: [UserResolver],
})
export class UserModule {}
