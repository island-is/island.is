import { Module } from '@nestjs/common'

import { UserResolver } from './user.resolver'
import { UserService } from './user.service'
import { AuthModule } from '@island.is/auth-nest-tools'
import { environment } from '../../../environments'

@Module({
  providers: [UserService, UserResolver],
  imports: [AuthModule.register(environment.identityServerAuth)],
  exports: [UserService],
})
export class UserModule {}
