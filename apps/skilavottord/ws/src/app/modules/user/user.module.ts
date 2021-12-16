import { Module } from '@nestjs/common'

import { AccessControlModule } from '../accessControl'
import { UserResolver } from './user.resolver'

@Module({
  imports: [AccessControlModule],
  providers: [UserResolver],
})
export class UserModule {}
