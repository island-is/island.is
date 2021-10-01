import { Module } from '@nestjs/common'

import { UserResolver } from './user.resolver'
import { AuthModule } from '@island.is/auth-nest-tools'
import { environment } from '../../../environments'

@Module({
  providers: [UserResolver],
  imports: [AuthModule.register(environment.identityServerAuth)],
})
export class UserModule {}
